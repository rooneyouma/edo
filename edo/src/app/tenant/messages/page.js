"use client";

import React, { useState, useEffect } from "react";
import TenantHeader from "../../../partials/tenant/TenantHeader.jsx";
import TenantSidebar from "../../../partials/tenant/TenantSidebar.jsx";
import { useSearchParams, useRouter } from "next/navigation";
import TenantChatView from "../../../components/tenant/messages/TenantChatView.jsx";
import ChatList from "../../../components/tenant/messages/ChatList.jsx";
import {
  isAuthenticated,
  chatAPI,
  tenantAPI,
  getStoredUser,
} from "../../../utils/api.js";
import Link from "next/link";

const Messages = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rentals, setRentals] = useState([]);
  const [loadingRentals, setLoadingRentals] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messageHistory, setMessageHistory] = useState({});
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);

    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Fetch tenant rentals
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await tenantAPI.getRentals();
        setRentals(data.rentals || []);
      } catch (err) {
        setError("Failed to fetch rental information");
        console.error("Error fetching rentals:", err);
      } finally {
        setLoadingRentals(false);
      }
    };

    if (isAuthenticated()) {
      fetchRentals();
    }
  }, []);

  // Fetch chat conversations and messages
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Fetch chat messages
        const chatMessages = await chatAPI.getMessages();
        console.log("Fetched chat messages:", chatMessages); // Debug log
        console.log("Current user:", getStoredUser()); // Debug log

        // Initialize with rentals as base conversations
        const processedConversations = [];
        const processedMessageHistory = {};

        // Create conversation entries for each rental property
        console.log("Creating conversations from rentals:", rentals); // Debug log
        if (rentals.length > 0) {
          rentals.forEach((rental, index) => {
            const conversation = {
              id: index + 1,
              propertyId: rental.property_id,
              propertyName: rental.property_name || "Property",
              unit: rental.unit_id || "",
              manager: {
                id: rental.landlord_id || 1, // Placeholder ID
                name: rental.landlord_name || "Property Manager",
                email: rental.landlord_email || "manager@example.com",
              },
              lastMessage: "",
              lastMessageTime: "",
              unread: false,
            };
            console.log("Created conversation:", conversation); // Debug log
            processedConversations.push(conversation);

            // Initialize empty message history for this conversation
            processedMessageHistory[index + 1] = [];
          });
        }

        // If we have chat messages, update the conversations with actual message data
        if (chatMessages && chatMessages.length > 0) {
          // Group messages by property/recipient
          const messageGroups = {};
          const currentUser = getStoredUser();
          console.log("Current user:", currentUser); // Debug log
          console.log("Chat messages:", chatMessages); // Debug log
          chatMessages.forEach((msg) => {
            // Group messages by property ID if available, otherwise group by the other participant
            let conversationKey = msg.property;

            // If no property ID, determine the conversation key based on sender/recipient relationship
            if (!conversationKey) {
              // If current user is the sender, group by recipient (the manager)
              // If current user is the recipient, group by sender (the manager)
              conversationKey =
                msg.sender_email === currentUser?.email
                  ? msg.recipient
                  : msg.sender;
            }

            console.log("Grouping message:", msg, "with key:", conversationKey); // Debug log

            if (!messageGroups[conversationKey]) {
              messageGroups[conversationKey] = [];
            }
            messageGroups[conversationKey].push(msg);
          });
          console.log("Message groups:", messageGroups); // Debug log

          // Update conversations with actual message data
          Object.keys(messageGroups).forEach((key) => {
            const messages = messageGroups[key];
            // Sort messages by timestamp to ensure correct order
            messages.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
            const latestMessage = messages[messages.length - 1];

            console.log("Processing message group:", key, messages); // Debug log

            // Find the conversation for this property or manager
            const conversationIndex = processedConversations.findIndex(
              (conv) => {
                // Match by property ID if available
                if (key && conv.propertyId && conv.propertyId == key) {
                  console.log(
                    "Matched conversation by property ID:",
                    key,
                    conv
                  ); // Debug log
                  return true;
                }
                // Match by manager ID for direct messages
                console.log(
                  "Checking manager ID match:",
                  key,
                  typeof key,
                  conv.manager.id,
                  typeof conv.manager.id,
                  key == conv.manager.id
                ); // Debug log
                if (key && conv.manager.id && conv.manager.id == key) {
                  console.log("Matched conversation by manager ID:", key, conv); // Debug log
                  return true;
                }
                // For cases where we're matching by sender/recipient relationship
                // Check if any message in this group is from the manager associated with this conversation
                // We need to check both sender and recipient because:
                // 1. If tenant sent the message, recipient will be the manager
                // 2. If manager sent the message, sender will be the manager
                console.log(
                  "Checking sender/recipient relationship for messages:",
                  messages,
                  "conversation manager:",
                  conv.manager.id
                ); // Debug log
                const match = messages.some((msg) => {
                  // Check if the message sender or recipient matches the conversation manager
                  const isMatch =
                    msg.sender === conv.manager.id ||
                    msg.recipient === conv.manager.id;
                  console.log(
                    "Checking message match:",
                    msg.sender,
                    msg.recipient,
                    conv.manager.id,
                    isMatch
                  ); // Debug log
                  return isMatch;
                });
                if (match) {
                  console.log(
                    "Matched conversation by sender/recipient relationship:",
                    key,
                    conv,
                    messages
                  ); // Debug log
                }
                return match;
              }
            );
            console.log("Found conversation index:", conversationIndex); // Debug log

            if (conversationIndex !== -1) {
              // Update existing conversation with message data
              processedConversations[conversationIndex] = {
                ...processedConversations[conversationIndex],
                lastMessage: latestMessage.message,
                lastMessageTime: latestMessage.timestamp,
                unread: !latestMessage.is_read,
              };
              console.log(
                "Updated existing conversation:",
                processedConversations[conversationIndex]
              ); // Debug log
            }

            // Store messages for this conversation
            if (conversationIndex !== -1) {
              processedMessageHistory[conversationIndex + 1] = messages.map(
                (msg) => {
                  // Determine if the message was sent by the current tenant
                  const currentUser = getStoredUser();
                  const isTenantMessage =
                    msg.sender_email === currentUser?.email;

                  return {
                    id: msg.id,
                    sender: isTenantMessage ? "tenant" : "manager",
                    content: msg.message,
                    timestamp: msg.timestamp,
                    read: msg.is_read,
                  };
                }
              );
              console.log(
                "Stored messages for conversation:",
                conversationIndex + 1,
                processedMessageHistory[conversationIndex + 1]
              ); // Debug log
            } else {
              // Handle case where conversation doesn't exist yet but messages do
              // This can happen when a landlord initiates a conversation
              console.log(
                "No existing conversation found for key:",
                key,
                "messages:",
                messages
              ); // Debug log
              const currentUser = getStoredUser();

              // Find messages from managers (not from current tenant)
              const managerMessages = messages.filter(
                (m) => m.sender_email !== currentUser?.email
              );

              // Also find messages from current tenant (to managers)
              const tenantMessages = messages.filter(
                (m) => m.sender_email === currentUser?.email
              );

              console.log("Manager messages:", managerMessages); // Debug log
              console.log("Tenant messages:", tenantMessages); // Debug log

              // Determine the manager ID from either sender (if manager sent message)
              // or recipient (if tenant sent message)
              let managerId = null;
              let managerEmail = null;

              if (managerMessages.length > 0) {
                // Manager sent messages to tenant
                managerId = managerMessages[0].sender;
                managerEmail = managerMessages[0].sender_email;
              } else if (tenantMessages.length > 0) {
                // Tenant sent messages to manager
                managerId = tenantMessages[0].recipient;
                managerEmail = null; // We don't have recipient email in this case
              }

              console.log("Determined manager ID:", managerId); // Debug log

              // Also check if we already have a conversation for this manager
              const existingManagerConversationIndex =
                processedConversations.findIndex(
                  (conv) => conv.manager.id == managerId
                );

              console.log(
                "Existing manager conversation index:",
                existingManagerConversationIndex
              ); // Debug log

              if (existingManagerConversationIndex !== -1) {
                // We already have a conversation for this manager, update it
                console.log("Updating existing manager conversation"); // Debug log
                processedConversations[existingManagerConversationIndex] = {
                  ...processedConversations[existingManagerConversationIndex],
                  lastMessage: latestMessage.message,
                  lastMessageTime: latestMessage.timestamp,
                  unread: !latestMessage.is_read,
                };

                processedMessageHistory[existingManagerConversationIndex + 1] =
                  messages.map((msg) => {
                    const isTenantMessage =
                      msg.sender_email === currentUser?.email;
                    return {
                      id: msg.id,
                      sender: isTenantMessage ? "tenant" : "manager",
                      content: msg.message,
                      timestamp: msg.timestamp,
                      read: msg.is_read,
                    };
                  });
                console.log(
                  "Updated existing manager conversation messages:",
                  existingManagerConversationIndex + 1,
                  processedMessageHistory[existingManagerConversationIndex + 1]
                ); // Debug log
              } else if (managerId) {
                const newConversationIndex = processedConversations.length;

                // Create a new conversation for this manager
                const newConversation = {
                  id: newConversationIndex + 1,
                  propertyId: null, // No property association for direct messages
                  propertyName: "Direct Message",
                  unit: "",
                  manager: {
                    id: managerId,
                    name: "Property Manager", // Will be updated if we have manager info
                    email: managerEmail || "manager@example.com",
                  },
                  lastMessage: latestMessage.message,
                  lastMessageTime: latestMessage.timestamp,
                  unread: !latestMessage.is_read,
                };

                processedConversations.push(newConversation);
                console.log("Created new conversation:", newConversation); // Debug log

                // Store messages for this new conversation
                processedMessageHistory[newConversationIndex + 1] =
                  messages.map((msg) => {
                    const isTenantMessage =
                      msg.sender_email === currentUser?.email;
                    return {
                      id: msg.id,
                      sender: isTenantMessage ? "tenant" : "manager",
                      content: msg.message,
                      timestamp: msg.timestamp,
                      read: msg.is_read,
                    };
                  });
                console.log(
                  "Stored messages for new conversation:",
                  newConversationIndex + 1,
                  processedMessageHistory[newConversationIndex + 1]
                ); // Debug log
              }
            }
          });
          console.log("Message groups:", messageGroups); // Debug log
        }

        console.log("Processed conversations:", processedConversations); // Debug log
        console.log("Processed message history:", processedMessageHistory); // Debug log
        setConversations(processedConversations);
        setMessageHistory(processedMessageHistory);
      } catch (err) {
        console.error("Error fetching chat data:", err);
        // Fallback to mock data if API fails
        // Create conversation entries for each rental property
        const fallbackConversations = [];
        const fallbackMessageHistory = {};

        if (rentals.length > 0) {
          rentals.forEach((rental, index) => {
            fallbackConversations.push({
              id: index + 1,
              propertyId: rental.property_id,
              propertyName: rental.property_name || "Property",
              unit: rental.unit_id || "",
              manager: {
                id: rental.landlord_id || 1,
                name: rental.landlord_name || "Property Manager",
                email: rental.landlord_email || "manager@example.com",
              },
              lastMessage: "",
              lastMessageTime: "",
              unread: false,
            });

            // Initialize empty message history for this conversation
            fallbackMessageHistory[index + 1] = [];
          });
        } else {
          // Fallback to original mock data if no rentals
          fallbackConversations.push(
            {
              id: 1,
              propertyId: 1,
              propertyName: "Sunset Apartments",
              unit: "101",
              manager: {
                id: 1,
                name: "John Smith",
                email: "john@sunsetapts.com",
              },
              lastMessage: "Thank you for your maintenance request...",
              lastMessageTime: "2024-02-20T10:30:00",
              unread: true,
            },
            {
              id: 2,
              propertyId: 2,
              propertyName: "Ocean View Condos",
              unit: "302",
              manager: {
                id: 2,
                name: "Sarah Johnson",
                email: "sarah@oceanview.com",
              },
              lastMessage: "Your rent payment has been received...",
              lastMessageTime: "2024-02-19T15:45:00",
              unread: false,
            }
          );

          fallbackMessageHistory[1] = [
            {
              id: 1,
              sender: "manager",
              content: "Hello! How can I help you today?",
              timestamp: "2024-02-20T10:30:00",
              read: true,
            },
            {
              id: 2,
              sender: "tenant",
              content: "I have a question about my maintenance request.",
              timestamp: "2024-02-20T10:31:00",
              read: true,
            },
          ];

          fallbackMessageHistory[2] = [
            {
              id: 1,
              sender: "manager",
              content: "Your rent payment has been received. Thank you!",
              timestamp: "2024-02-19T15:45:00",
              read: true,
            },
          ];
        }

        setConversations(fallbackConversations);
        setMessageHistory(fallbackMessageHistory);
      }
    };

    if (isAuthenticated() && rentals.length > 0) {
      fetchChatData();
    }
  }, [rentals]);

  // Handle managerId from URL
  useEffect(() => {
    if (searchParams.get("managerId")) {
      const managerId = parseInt(searchParams.get("managerId"));
      const conversation = conversations.find(
        (conv) => conv.manager.id === managerId
      );
      if (conversation) {
        setSelectedChat(conversation);
      }
    }
  }, [searchParams, conversations]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Message selection and deletion functions
  const toggleMessageSelection = (messageId) => {
    setSelectedMessages((prevSelected) => {
      if (prevSelected.includes(messageId)) {
        return prevSelected.filter((id) => id !== messageId);
      } else {
        return [...prevSelected, messageId];
      }
    });
  };

  const handleLongPress = (messageId) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedMessages([messageId]);
    } else {
      toggleMessageSelection(messageId);
    }
  };

  const startLongPress = (messageId) => {
    if (isSelectionMode) {
      toggleMessageSelection(messageId);
      return;
    }

    const timer = setTimeout(() => {
      handleLongPress(messageId);
    }, 500); // 500ms for long press

    setLongPressTimer(timer);
  };

  const cancelLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedMessages([]);
  };

  const deleteSelectedMessages = async () => {
    if (selectedMessages.length === 0) return;

    try {
      if (selectedMessages.length === 1) {
        // Delete single message
        await chatAPI.deleteMessage(selectedMessages[0]);
      } else {
        // Delete multiple messages
        await chatAPI.deleteMultipleMessages(selectedMessages);
      }

      // Update local state to remove deleted messages
      setMessageHistory((prevHistory) => {
        const updatedHistory = { ...prevHistory };
        if (updatedHistory[selectedChat.id]) {
          updatedHistory[selectedChat.id] = updatedHistory[
            selectedChat.id
          ].filter((msg) => !selectedMessages.includes(msg.id));
        }
        return updatedHistory;
      });

      // Exit selection mode
      exitSelectionMode();
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  };

  // Function to handle sending a message
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    setIsLoading(true);
    try {
      // Send message to backend
      const messageData = {
        recipient: selectedChat.manager.id,
        message: messageInput.trim(),
        property: selectedChat.propertyId,
        // Fix: Send unit as integer ID or null, not as string
        unit: selectedChat.unit ? parseInt(selectedChat.unit) : null,
      };

      // This will send the message to the backend, which will:
      // 1. Store it in the database
      // 2. Make it available for the landlord to see in their received messages
      // 3. Make it appear in the landlord's chat with this tenant
      const response = await chatAPI.sendMessage(messageData);

      // Create message object for tenant's UI
      const newMessage = {
        id: response.id || Date.now(),
        sender: "tenant", // Explicitly set sender as tenant for the tenant's view
        content: messageInput.trim(),
        timestamp: response.timestamp || new Date().toISOString(),
        read: false, // Tenant's sent message starts as unread by landlord
      };

      // Update message history
      setMessageHistory((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
      }));

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedChat.id
            ? {
                ...conv,
                lastMessage: newMessage.content,
                lastMessageTime: newMessage.timestamp,
                unread: false,
              }
            : conv
        )
      );

      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle chat selection
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Mark all messages in this chat as read
    setMessageHistory((prev) => ({
      ...prev,
      [chat.id]: (prev[chat.id] || []).map((msg) => ({
        ...msg,
        read: true,
      })),
    }));
    // Mark conversation as read
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === chat.id ? { ...conv, unread: false } : conv
      )
    );
    // Update URL with managerId
    router.push(`/tenant/messages?managerId=${chat.manager.id}`);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="mb-6">You must be signed in to access this page.</p>
        <Link
          href={`/auth/signin?role=tenant&next=/tenant/messages`}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Proceed to Sign In
        </Link>
      </div>
    );
  }

  // Check if tenant has rentals
  const hasRentals = rentals.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TenantHeader toggleSidebar={toggleSidebar} />
          {/* Main content */}
          <main className="flex-1 transition-all duration-200 bg-slate-50">
            <div className="px-4 sm:px-6 lg:px-8 py-2 md:py-4 h-full min-h-0 flex flex-col">
              {/* Page header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#0d9488] flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Messages
                  </h1>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  {/* Mobile search toggle button */}
                  <button className="sm:hidden p-2 rounded-md bg-white border border-gray-300 text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile header for chat view */}
              {selectedChat && (
                <div className="lg:hidden p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="p-2 rounded-full hover:bg-slate-100"
                  >
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {selectedChat.manager && selectedChat.manager.name
                          ? selectedChat.manager.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "M"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {selectedChat.manager.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {selectedChat.propertyName}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8"></div> {/* Spacer for alignment */}
                </div>
              )}
              <div className="mt-2 sm:mt-4 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 h-full">
                  {/* Conversations list */}
                  <div
                    className={`lg:col-span-4 border border-gray-200 rounded-lg overflow-hidden ${
                      selectedChat ? "hidden lg:block" : "block"
                    } min-h-0 h-full flex flex-col`}
                  >
                    <div className="h-full flex flex-col min-h-0">
                      <ChatList
                        conversations={conversations}
                        selectedChat={selectedChat}
                        onChatSelect={handleChatSelect}
                        formatDate={formatDate}
                        hasRentals={hasRentals}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                      />
                    </div>
                  </div>

                  {/* Chat area */}
                  <div
                    className={`lg:col-span-8 border border-gray-200 rounded-lg overflow-hidden ${
                      selectedChat ? "block" : "hidden lg:block"
                    } min-h-0 h-full flex flex-col`}
                  >
                    <div className="lg:hidden">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="p-3 sm:p-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span className="text-sm">Back to Chats</span>
                      </button>
                    </div>
                    {hasRentals ? (
                      <TenantChatView
                        selectedChat={selectedChat}
                        messages={messageHistory}
                        newChatMessage={messageInput}
                        setNewChatMessage={setMessageInput}
                        handleMessageSubmit={handleMessageSubmit}
                        formatDate={formatDate}
                        isSelectionMode={isSelectionMode}
                        selectedMessages={selectedMessages}
                        toggleMessageSelection={toggleMessageSelection}
                        startLongPress={startLongPress}
                        cancelLongPress={cancelLongPress}
                        deleteSelectedMessages={deleteSelectedMessages}
                        exitSelectionMode={exitSelectionMode}
                        isMobile={isMobile}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-50 p-4">
                        <div className="text-center max-w-xs">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900">
                            No property managers
                          </h3>
                          <p className="mt-2 text-xs sm:text-sm text-gray-500">
                            You are not registered under any rental properties.
                          </p>
                          <p className="mt-1 text-xs sm:text-sm text-gray-500">
                            Once you are assigned to a property, you can
                            communicate with your property managers here.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Messages;
