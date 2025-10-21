"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../../partials/dashboard/LandlordSidebar";
import Header from "../../../partials/dashboard/LandlordHeader";
import MessageFilters from "../../../components/landlord/messages/MessageFilters";
import MessageTable from "../../../components/landlord/messages/MessageTable";
import MessageDetailModal from "../../../components/landlord/messages/MessageDetailModal";
import NewMessageModal from "../../../components/landlord/messages/NewMessageModal";
import ChatView from "../../../components/landlord/messages/ChatView";
import ChatList from "../../../components/landlord/messages/ChatList";
import StartChatModal from "../../../components/landlord/messages/StartChatModal";
import DeleteConfirmModal from "../../../components/landlord/maintenance/DeleteConfirmModal";
import Modal from "../../../partials/Modal";
import {
  isAuthenticated,
  chatAPI,
  landlordTenantAPI,
  getStoredUser,
} from "../../../utils/api";

const Messages = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("email");
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [messages, setMessages] = useState([]); // Start with empty array instead of mock data
  const [sentMessages, setSentMessages] = useState([]); // For sent messages in email view
  const [receivedMessages, setReceivedMessages] = useState([]); // For received messages in email view
  const [tenants, setTenants] = useState([]); // Store actual tenants
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Message selection and deletion states
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Table message selection and deletion states
  const [selectedTableMessages, setSelectedTableMessages] = useState([]);
  const [isTableSelectionMode, setIsTableSelectionMode] = useState(false);

  // Email view state
  const [receivedSearchQuery, setReceivedSearchQuery] = useState("");
  const [sentSearchQuery, setSentSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [sentDateFilter, setSentDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [sentPropertyFilter, setSentPropertyFilter] = useState("all");
  const [receivedSortOrder, setReceivedSortOrder] = useState("latest");
  const [sentSortOrder, setSentSortOrder] = useState("latest");
  const [currentReceivedPage, setCurrentReceivedPage] = useState(1);
  const [currentSentPage, setCurrentSentPage] = useState(1);
  const [receivedPageInputValue, setReceivedPageInputValue] = useState("1");
  const [sentPageInputValue, setSentPageInputValue] = useState("1");
  const [selectedEmailMessage, setSelectedEmailMessage] = useState(null);
  const [isEmailMessageModalOpen, setIsEmailMessageModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // New message modal state
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: "",
    message: "",
  });
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");
  const [filteredTenants, setFilteredTenants] = useState([]);

  const itemsPerPage = 5;

  // Add state for message tabs
  const [messageTab, setMessageTab] = useState("received");

  // Add state for start chat modal
  const [showStartChatModal, setShowStartChatModal] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    // Check if device is mobile
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check authentication after client-side rendering
  useEffect(() => {
    if (isClient && !isAuthenticated()) {
      router.push(
        `/auth/signin?role=landlord&next=${encodeURIComponent(pathname)}`
      );
    }
  }, [isClient, router, pathname]);

  // Fetch chat messages and tenants when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch chat messages
        const chatMessages = await chatAPI.getMessages();

        // Fetch tenants
        const tenantData = await landlordTenantAPI.list();
        console.log("Tenant data structure:", tenantData[0]); // Debug log
        setTenants(tenantData);

        // Process chat messages into the format expected by the UI
        const processedMessages = processChatMessages(chatMessages, tenantData);
        setMessages(processedMessages);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load messages and tenants");
      } finally {
        setLoading(false);
      }
    };

    if (isClient && isAuthenticated()) {
      fetchData();
    }
  }, [isClient]);

  // Process chat messages into the format expected by the UI
  const processChatMessages = (chatMessages, tenantData) => {
    // Group messages by tenant
    const tenantMessages = {};

    chatMessages.forEach((msg) => {
      // Find the tenant associated with this message
      const tenant = tenantData.find(
        (t) => t.user === msg.sender || t.user === msg.recipient
      );

      if (tenant) {
        const tenantId = tenant.id;
        if (!tenantMessages[tenantId]) {
          tenantMessages[tenantId] = {
            id: tenantId,
            tenant: `${tenant.first_name} ${tenant.last_name}`,
            tenantEmail: tenant.email,
            property: tenant.unit?.property?.name || tenant.property || "N/A",
            unit: tenant.unit?.unit_id || "N/A",
            messages: [],
            lastMessage: "",
            lastMessageTime: "",
            unread: false,
            status: "read",
          };
        }

        // Determine the sender type based on the current user context
        // If the sender is the current landlord, mark as "landlord"
        // If the sender is the tenant, mark as "tenant"
        const senderType = msg.sender === msg.recipient ? "landlord" : "tenant";

        // Add message to tenant's conversation
        tenantMessages[tenantId].messages.push({
          id: msg.id,
          sender: senderType,
          content: msg.message,
          timestamp: msg.timestamp,
          read: msg.is_read,
        });

        // Update last message info
        if (
          !tenantMessages[tenantId].lastMessageTime ||
          new Date(msg.timestamp) >
            new Date(tenantMessages[tenantId].lastMessageTime)
        ) {
          tenantMessages[tenantId].lastMessage = msg.message;
          tenantMessages[tenantId].lastMessageTime = msg.timestamp;
          tenantMessages[tenantId].unread =
            !msg.is_read && msg.sender !== msg.recipient;
          tenantMessages[tenantId].status = msg.is_read ? "read" : "unread";
        }
      }
    });

    // Convert to array and sort by last message time
    return Object.values(tenantMessages).sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Transform chat messages into table records
  const transformMessagesForTable = (messages) => {
    const tableRecords = [];
    messages.forEach((chat) => {
      chat.messages.forEach((message) => {
        tableRecords.push({
          id: `${chat.id}-${message.id}`,
          tenant: chat.tenant,
          property: chat.property,
          unit: chat.unit,
          content: message.content,
          timestamp: message.timestamp,
          sender: message.sender,
          status:
            message.sender === "tenant"
              ? chat.unread
                ? "unread"
                : "read"
              : "read",
        });
      });
    });
    return tableRecords.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA;
    });
  };

  // Helper function to format dates consistently
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

  // Filter messages for email view
  const filteredReceivedMessages = transformMessagesForTable(messages)
    .filter((message) => message.sender === "tenant")
    .filter((message) => {
      const matchesSearch =
        message.tenant
          .toLowerCase()
          .includes(receivedSearchQuery.toLowerCase()) ||
        message.property
          .toLowerCase()
          .includes(receivedSearchQuery.toLowerCase()) ||
        message.content
          .toLowerCase()
          .includes(receivedSearchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || message.status === statusFilter;
      const matchesProperty =
        propertyFilter === "all" || message.property === propertyFilter;

      let matchesDate = true;
      if (dateFilter.startDate || dateFilter.endDate) {
        const messageDate = new Date(message.timestamp);
        if (dateFilter.startDate) {
          const startDate = new Date(dateFilter.startDate);
          startDate.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && messageDate >= startDate;
        }
        if (dateFilter.endDate) {
          const endDate = new Date(dateFilter.endDate);
          endDate.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && messageDate <= endDate;
        }
      }

      return matchesSearch && matchesStatus && matchesProperty && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return receivedSortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  const filteredSentMessages = transformMessagesForTable(messages)
    .filter((message) => message.sender === "landlord")
    .filter((message) => {
      const matchesSearch =
        message.tenant.toLowerCase().includes(sentSearchQuery.toLowerCase()) ||
        message.property
          .toLowerCase()
          .includes(sentSearchQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(sentSearchQuery.toLowerCase());

      const matchesProperty =
        sentPropertyFilter === "all" || message.property === sentPropertyFilter;

      let matchesDate = true;
      if (sentDateFilter.startDate || sentDateFilter.endDate) {
        const messageDate = new Date(message.timestamp);
        if (sentDateFilter.startDate) {
          const startDate = new Date(sentDateFilter.startDate);
          startDate.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && messageDate >= startDate;
        }
        if (sentDateFilter.endDate) {
          const endDate = new Date(sentDateFilter.endDate);
          endDate.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && messageDate <= endDate;
        }
      }

      return matchesSearch && matchesProperty && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sentSortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  // Calculate pagination
  const totalReceivedPages = Math.ceil(
    filteredReceivedMessages.length / itemsPerPage
  );
  const totalSentPages = Math.ceil(filteredSentMessages.length / itemsPerPage);

  // Get current page messages
  const currentReceivedMessages = filteredReceivedMessages.slice(
    (currentReceivedPage - 1) * itemsPerPage,
    currentReceivedPage * itemsPerPage
  );

  const currentSentMessages = filteredSentMessages.slice(
    (currentSentPage - 1) * itemsPerPage,
    currentSentPage * itemsPerPage
  );

  // Extract available properties from messages for dynamic filtering
  const availableProperties = [
    ...new Set(
      transformMessagesForTable(messages)
        .map((message) => message.property)
        .filter((property) => property && property !== "N/A")
    ),
  ].sort();

  // Handle message actions
  const handleEmailMessageClick = (message) => {
    setSelectedEmailMessage(message);
    setIsEmailMessageModalOpen(true);

    if (message.status === "unread") {
      setMessages((prevMessages) =>
        prevMessages.map((chat) => {
          if (chat.id === parseInt(message.id.split("-")[0])) {
            return { ...chat, unread: false, status: "read" };
          }
          return chat;
        })
      );
    }
  };

  const handleDeleteMessage = async () => {
    if (messageToDelete) {
      const [chatId, messageId] = messageToDelete.id.split("-");

      try {
        // Delete message from the database
        await chatAPI.deleteMessage(parseInt(messageId));

        // Update local state
        setMessages((prevMessages) =>
          prevMessages.map((chat) => {
            if (chat.id === parseInt(chatId)) {
              const filteredMessages = chat.messages.filter(
                (msg) => msg.id !== parseInt(messageId)
              );
              return {
                ...chat,
                messages: filteredMessages,
                lastMessage:
                  filteredMessages[filteredMessages.length - 1]?.content || "",
                lastMessageTime:
                  filteredMessages[filteredMessages.length - 1]?.timestamp ||
                  "",
              };
            }
            return chat;
          })
        );

        // Also update sent and received messages tables
        if (viewMode === "sent") {
          setSentMessages((prev) =>
            prev.filter((msg) => msg.id !== parseInt(messageId))
          );
        } else if (viewMode === "received") {
          setReceivedMessages((prev) =>
            prev.filter((msg) => msg.id !== parseInt(messageId))
          );
        }

        setIsDeleteConfirmModalOpen(false);
        setMessageToDelete(null);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  // Table message selection and deletion functions
  const toggleTableMessageSelection = (messageId) => {
    setSelectedTableMessages((prevSelected) => {
      if (prevSelected.includes(messageId)) {
        return prevSelected.filter((id) => id !== messageId);
      } else {
        return [...prevSelected, messageId];
      }
    });
  };

  const enterTableSelectionMode = (messageId) => {
    setIsTableSelectionMode(true);
    setSelectedTableMessages([messageId]);
  };

  const exitTableSelectionMode = () => {
    setIsTableSelectionMode(false);
    setSelectedTableMessages([]);
  };

  const deleteSelectedTableMessages = async () => {
    if (selectedTableMessages.length === 0) return;

    try {
      if (selectedTableMessages.length === 1) {
        // Delete single message
        await chatAPI.deleteMessage(selectedTableMessages[0]);
      } else {
        // Delete multiple messages
        await chatAPI.deleteMultipleMessages(selectedTableMessages);
      }

      // Update local state based on current view
      if (viewMode === "sent") {
        setSentMessages((prev) =>
          prev.filter((msg) => !selectedTableMessages.includes(msg.id))
        );
      } else if (viewMode === "received") {
        setReceivedMessages((prev) =>
          prev.filter((msg) => !selectedTableMessages.includes(msg.id))
        );
      }

      // Also update chat messages if applicable
      setMessages((prevMessages) =>
        prevMessages.map((chat) => {
          const filteredMessages = chat.messages.filter(
            (msg) => !selectedTableMessages.includes(msg.id)
          );

          if (filteredMessages.length !== chat.messages.length) {
            return {
              ...chat,
              messages: filteredMessages,
              lastMessage:
                filteredMessages[filteredMessages.length - 1]?.content || "",
              lastMessageTime:
                filteredMessages[filteredMessages.length - 1]?.timestamp || "",
            };
          }
          return chat;
        })
      );

      // Exit selection mode
      exitTableSelectionMode();
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  };

  // Filter tenants based on search query
  useEffect(() => {
    if (tenantSearchQuery) {
      const filtered = tenants
        .filter(
          (tenant) =>
            `${tenant.first_name} ${tenant.last_name}`
              .toLowerCase()
              .includes(tenantSearchQuery.toLowerCase()) ||
            tenant.email
              ?.toLowerCase()
              .includes(tenantSearchQuery.toLowerCase()) ||
            tenant.unit?.unit_id
              ?.toLowerCase()
              .includes(tenantSearchQuery.toLowerCase())
        )
        .map((tenant) => ({
          id: tenant.id,
          name: `${tenant.first_name} ${tenant.last_name}`,
          email: tenant.email,
          property: tenant.unit?.property?.name || tenant.property || "N/A",
          unit: tenant.unit?.unit_id || "N/A",
        }));
      setFilteredTenants(filtered);
    } else {
      setFilteredTenants([]);
    }
  }, [tenantSearchQuery, tenants]);

  const handleSendNewMessage = async () => {
    if (!newMessage.recipient || !newMessage.message) {
      alert("Recipient and message cannot be empty.");
      return;
    }

    try {
      // Find the selected tenant to get property and unit info
      const selectedTenant = tenants.find(
        (t) => t.id === parseInt(newMessage.recipient)
      );

      // Send message to backend
      const messageData = {
        recipient: parseInt(newMessage.recipient),
        message: newMessage.message,
        // Get property and unit from selected tenant
        property:
          selectedTenant?.unit?.property?.id ||
          selectedTenant?.property_id ||
          null,
        unit: selectedTenant?.unit?.id || selectedTenant?.unit_id || null,
      };

      const response = await chatAPI.sendMessage(messageData);

      // Update UI with new message
      const newMessageObj = {
        id: response.id,
        sender: "landlord", // Explicitly set sender as landlord for the landlord's view
        content: newMessage.message,
        timestamp: response.timestamp,
        status: "sent",
      };

      // Update chat conversations
      setMessages((prevMessages) => {
        let chatExists = false;
        const updatedMessages = prevMessages.map((chat) => {
          if (chat.id === parseInt(newMessage.recipient)) {
            chatExists = true;
            return {
              ...chat,
              messages: [...chat.messages, newMessageObj],
              lastMessage: newMessageObj.content,
              lastMessageTime: newMessageObj.timestamp,
            };
          }
          return chat;
        });

        if (!chatExists) {
          // Create new chat if it doesn't exist
          const tenant = tenants.find(
            (t) => t.id === parseInt(newMessage.recipient)
          );
          if (tenant) {
            const newChat = {
              id: tenant.id,
              tenant: `${tenant.first_name} ${tenant.last_name}`,
              tenantEmail: tenant.email,
              property: tenant.unit?.property?.name || tenant.property || "N/A",
              unit: tenant.unit?.unit_id || "N/A",
              messages: [newMessageObj],
              lastMessage: newMessageObj.content,
              lastMessageTime: newMessageObj.timestamp,
              unread: false,
              status: "read",
            };
            return [...updatedMessages, newChat];
          }
        }

        return updatedMessages;
      });

      // Update sent messages table
      const sentMessageObj = {
        id: response.id,
        sender: "landlord",
        tenant: selectedTenant
          ? `${selectedTenant.first_name} ${selectedTenant.last_name}`
          : "Unknown",
        property:
          selectedTenant?.unit?.property?.name ||
          selectedTenant?.property ||
          "N/A",
        unit: selectedTenant?.unit?.unit_id || selectedTenant?.unit_id || "N/A",
        content: newMessage.message,
        timestamp: response.timestamp,
        status: "sent",
      };

      // Add to sent messages list
      setSentMessages((prev) => [sentMessageObj, ...prev]);

      setShowNewMessageModal(false);
      setNewMessage({
        recipient: "",
        message: "",
      });
      setTenantSearchQuery("");
      setFilteredTenants([]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !selectedChat) {
      return;
    }

    try {
      // Send message to backend
      const messageData = {
        recipient: selectedChat.id, // Tenant ID
        recipient_email: selectedChat.email, // Add recipient email for proper routing
        message: newChatMessage.trim(),
        property:
          selectedChat.property && !isNaN(selectedChat.property)
            ? parseInt(selectedChat.property)
            : null,
        unit:
          selectedChat.unit && !isNaN(selectedChat.unit)
            ? parseInt(selectedChat.unit)
            : null,
      };

      console.log("Sending message with data:", messageData); // Debug log
      const response = await chatAPI.sendMessage(messageData);

      const newMessage = {
        id: response.id || Date.now(), // Fallback ID if response doesn't provide one
        sender: "landlord", // Explicitly set sender as landlord for the landlord's view
        sender_id: getStoredUser()?.id, // Add sender ID for proper routing
        sender_email: getStoredUser()?.email, // Add sender email for proper routing
        recipient_id: selectedChat.id, // Add recipient ID
        recipient_email: selectedChat.email, // Add recipient email
        content: newChatMessage.trim(),
        timestamp: response.timestamp || new Date().toISOString(),
        read: true,
      };

      // Update chat conversations
      let updatedSelectedChat = null;
      const updatedMessages = messages.map((chat) => {
        if (chat.id === selectedChat.id) {
          updatedSelectedChat = {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: newMessage.content,
            lastMessageTime: newMessage.timestamp,
            unread: false,
            status: "read",
          };
          return updatedSelectedChat;
        }
        return chat;
      });

      // Update sent messages table
      const sentMessageObj = {
        id: response.id || Date.now(),
        sender: "landlord",
        tenant: selectedChat.tenant,
        property: selectedChat.property,
        unit: selectedChat.unit,
        content: newChatMessage.trim(),
        timestamp: response.timestamp || new Date().toISOString(),
        status: "sent",
      };

      // Add to sent messages list
      setSentMessages((prev) => [sentMessageObj, ...prev]);

      setMessages(updatedMessages);
      setSelectedChat(updatedSelectedChat);
      setNewChatMessage("");

      // Scroll to bottom of chat
      setTimeout(() => {
        const chatContainer = document.querySelector(".chat-messages");
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setMessages((prevMessages) =>
      prevMessages.map((c) => {
        if (c.id === chat.id) {
          return { ...c, unread: false, status: "read" };
        }
        return c;
      })
    );
  };

  const handleReceivedPageChange = (pageNumber) => {
    setCurrentReceivedPage(pageNumber);
    setReceivedPageInputValue(pageNumber.toString());
  };

  const handleSentPageChange = (pageNumber) => {
    setCurrentSentPage(pageNumber);
    setSentPageInputValue(pageNumber.toString());
  };

  // Add function to handle starting a new chat
  const handleStartNewChat = () => {
    setShowStartChatModal(true);
  };

  // Message selection and deletion functions
  const toggleMessageSelection = (messageId) => {
    setSelectedMessages((prev) => {
      if (prev.includes(messageId)) {
        return prev.filter((id) => id !== messageId);
      } else {
        return [...prev, messageId];
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
    if (isMobile) {
      const timer = setTimeout(() => {
        handleLongPress(messageId);
      }, 500); // 500ms for long press
      setLongPressTimer(timer);
    }
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
        await chatAPI.deleteMessage(selectedMessages[0]);
      } else {
        await chatAPI.deleteMultipleMessages(selectedMessages);
      }

      // Update UI by removing deleted messages
      setMessages((prevMessages) => {
        return prevMessages.map((chat) => {
          if (chat.id === selectedChat?.id) {
            return {
              ...chat,
              messages: chat.messages.filter(
                (msg) => !selectedMessages.includes(msg.id)
              ),
            };
          }
          return chat;
        });
      });

      // Also remove from sent messages table if applicable
      setSentMessages((prev) =>
        prev.filter((msg) => !selectedMessages.includes(msg.id))
      );

      // Exit selection mode
      exitSelectionMode();
    } catch (error) {
      console.error("Error deleting messages:", error);
      alert("Failed to delete messages. Please try again.");
    }
  };

  // Add function to handle selecting a tenant for a new chat
  const handleSelectTenant = (tenant) => {
    // Check if a chat already exists with this tenant
    const existingChat = messages.find((chat) => chat.id === tenant.id);

    if (existingChat) {
      // If chat exists, select it
      handleChatSelect(existingChat);
    } else {
      // If chat doesn't exist, create a new one
      const newChat = {
        id: tenant.id,
        tenant:
          tenant.name ||
          `${tenant.first_name || ""} ${tenant.last_name || ""}`.trim() ||
          "Unknown Tenant",
        tenantEmail: tenant.email || "",
        property: tenant.property || "Unknown Property",
        unit: tenant.unit || "Unknown Unit",
        messages: [],
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        unread: false,
        status: "read",
      };

      setMessages((prevMessages) => [...prevMessages, newChat]);
      handleChatSelect(newChat);
    }

    setShowStartChatModal(false);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="mb-6">You must be signed in to access this page.</p>
        <button
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
          onClick={() =>
            router.push(
              `/auth/signin?role=landlord&next=${encodeURIComponent(pathname)}`
            )
          }
        >
          Proceed
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        <Header toggleSidebar={toggleSidebar} />

        <main className="grow">
          <div className="px-4 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#0d9488] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 text-slate-900">
                  Messages
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("email")}
                    className={`relative inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-l-md border ${
                      viewMode === "email"
                        ? "bg-[#0d9488] text-white border-[#0d9488]"
                        : "bg-white bg-white text-gray-700 text-slate-600 border-gray-300 border-gray-300"
                    }`}
                  >
                    Email View
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("chat")}
                    className={`relative inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-r-md border ${
                      viewMode === "chat"
                        ? "bg-[#0d9488] text-white border-[#0d9488]"
                        : "bg-white bg-white text-gray-700 text-slate-600 border-gray-300 border-gray-300"
                    }`}
                  >
                    Chat View
                  </button>
                </div>
                <button
                  onClick={() => setShowNewMessageModal(true)}
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                >
                  New Message
                </button>
              </div>
            </div>

            {viewMode === "email" ? (
              <>
                {/* Horizontal Status Menu for Received/Sent */}
                <div className="border-b border-slate-200 border-slate-200 mb-4 sm:mb-6 overflow-x-auto scrollbar-none">
                  <nav className="-mb-px flex space-x-4 sm:space-x-6 md:space-x-8 min-w-max">
                    <button
                      onClick={() => setMessageTab("received")}
                      className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm sm:text-sm ${
                        messageTab === "received"
                          ? "border-teal-500 text-teal-600 text-teal-600"
                          : "border-transparent text-slate-500 text-slate-500 hover:text-slate-700 hover:text-slate-700"
                      }`}
                    >
                      <span className="hidden sm:inline">
                        Received Messages
                      </span>
                      <span className="sm:hidden">Received</span>
                    </button>
                    <button
                      onClick={() => setMessageTab("sent")}
                      className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm sm:text-sm ${
                        messageTab === "sent"
                          ? "border-teal-500 text-teal-600 text-teal-600"
                          : "border-transparent text-slate-500 text-slate-500 hover:text-slate-700 hover:text-slate-700"
                      }`}
                    >
                      <span className="hidden sm:inline">Sent Messages</span>
                      <span className="sm:hidden">Sent</span>
                    </button>
                  </nav>
                </div>
                {/* Tab Content */}
                {messageTab === "received" ? (
                  <>
                    <MessageFilters
                      searchQuery={receivedSearchQuery}
                      setSearchQuery={setReceivedSearchQuery}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      propertyFilter={propertyFilter}
                      setPropertyFilter={setPropertyFilter}
                      dateFilter={dateFilter}
                      setDateFilter={setDateFilter}
                      sortOrder={receivedSortOrder}
                      setSortOrder={setReceivedSortOrder}
                      availableProperties={availableProperties}
                    />
                    <MessageTable
                      messages={currentReceivedMessages}
                      onMessageClick={handleEmailMessageClick}
                      onDeleteClick={(message) => {
                        setMessageToDelete(message);
                        setIsDeleteConfirmModalOpen(true);
                      }}
                      formatDate={formatDate}
                      isSelectionMode={isTableSelectionMode}
                      selectedMessages={selectedTableMessages}
                      toggleMessageSelection={toggleTableMessageSelection}
                      enterSelectionMode={enterTableSelectionMode}
                      exitSelectionMode={exitTableSelectionMode}
                      deleteSelectedMessages={deleteSelectedTableMessages}
                    />
                    {/* Received Messages Pagination */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 border-gray-200 bg-white bg-white px-4 py-3">
                      <div className="flex items-center justify-between w-full sm:w-auto">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="text-xs text-gray-700 text-slate-700">
                            Page {currentReceivedPage} of {totalReceivedPages}
                          </span>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="text-xs text-gray-700 text-slate-700 hidden sm:inline">
                              Go to:
                            </span>
                            <input
                              type="number"
                              min="1"
                              max={totalReceivedPages}
                              value={receivedPageInputValue}
                              onChange={(e) => {
                                const value = e.target.value;
                                setReceivedPageInputValue(value);
                                const page = parseInt(value);
                                if (page >= 1 && page <= totalReceivedPages) {
                                  handleReceivedPageChange(page);
                                }
                              }}
                              onBlur={() => {
                                const page = parseInt(receivedPageInputValue);
                                if (page < 1) {
                                  setReceivedPageInputValue("1");
                                  handleReceivedPageChange(1);
                                } else if (page > totalReceivedPages) {
                                  setReceivedPageInputValue(
                                    totalReceivedPages.toString()
                                  );
                                  handleReceivedPageChange(totalReceivedPages);
                                }
                              }}
                              className="w-12 h-7 text-xs text-center rounded border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 caret-slate-900 dark:caret-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() =>
                            handleReceivedPageChange(currentReceivedPage - 1)
                          }
                          disabled={currentReceivedPage === 1}
                          className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-4 h-4"
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
                        <button
                          onClick={() =>
                            handleReceivedPageChange(currentReceivedPage + 1)
                          }
                          disabled={currentReceivedPage === totalReceivedPages}
                          className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <MessageFilters
                      searchQuery={sentSearchQuery}
                      setSearchQuery={setSentSearchQuery}
                      propertyFilter={sentPropertyFilter}
                      setPropertyFilter={setSentPropertyFilter}
                      dateFilter={sentDateFilter}
                      setDateFilter={setSentDateFilter}
                      sortOrder={sentSortOrder}
                      setSortOrder={setSentSortOrder}
                      isSent={true}
                      availableProperties={availableProperties}
                    />
                    <MessageTable
                      messages={currentSentMessages}
                      onMessageClick={handleEmailMessageClick}
                      onDeleteClick={(message) => {
                        setMessageToDelete(message);
                        setIsDeleteConfirmModalOpen(true);
                      }}
                      formatDate={formatDate}
                      isSent={true}
                      isSelectionMode={isTableSelectionMode}
                      selectedMessages={selectedTableMessages}
                      toggleMessageSelection={toggleTableMessageSelection}
                      enterSelectionMode={enterTableSelectionMode}
                      exitSelectionMode={exitTableSelectionMode}
                      deleteSelectedMessages={deleteSelectedTableMessages}
                    />
                    {/* Sent Messages Pagination */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 border-gray-200 bg-white bg-white px-4 py-3">
                      <div className="flex items-center justify-between w-full sm:w-auto">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="text-xs text-gray-700 text-slate-700">
                            Page {currentSentPage} of {totalSentPages}
                          </span>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="text-xs text-gray-700 text-slate-700 hidden sm:inline">
                              Go to:
                            </span>
                            <input
                              type="number"
                              min="1"
                              max={totalSentPages}
                              value={sentPageInputValue}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSentPageInputValue(value);
                                const page = parseInt(value);
                                if (page >= 1 && page <= totalSentPages) {
                                  handleSentPageChange(page);
                                }
                              }}
                              onBlur={() => {
                                const page = parseInt(sentPageInputValue);
                                if (page < 1) {
                                  setSentPageInputValue("1");
                                  handleSentPageChange(1);
                                } else if (page > totalSentPages) {
                                  setSentPageInputValue(
                                    totalSentPages.toString()
                                  );
                                  handleSentPageChange(totalSentPages);
                                }
                              }}
                              className="w-12 h-7 text-xs text-center rounded border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 caret-slate-900 dark:caret-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() =>
                            handleSentPageChange(currentSentPage - 1)
                          }
                          disabled={currentSentPage === 1}
                          className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-4 h-4"
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
                        <button
                          onClick={() =>
                            handleSentPageChange(currentSentPage + 1)
                          }
                          disabled={currentSentPage === totalSentPages}
                          className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="mt-4 sm:mt-6 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 h-full">
                  <div
                    className={`lg:col-span-4 border border-gray-200 border-gray-200 rounded-lg overflow-hidden ${
                      selectedChat ? "hidden lg:block" : "block"
                    }`}
                  >
                    <div className="h-full flex flex-col">
                      <ChatList
                        messages={messages}
                        selectedChat={selectedChat}
                        onChatSelect={handleChatSelect}
                        formatDate={formatDate}
                        onStartNewChat={handleStartNewChat}
                        mockTenants={tenants} // Pass actual tenants instead of mock data
                      />
                    </div>
                  </div>
                  <div
                    className={`lg:col-span-8 border border-gray-200 border-gray-200 rounded-lg overflow-hidden ${
                      selectedChat ? "block" : "hidden lg:block"
                    } min-h-0 h-full flex flex-col`}
                  >
                    <div className="lg:hidden border-b border-gray-200 border-gray-200">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="w-full p-3 sm:p-4 flex items-center space-x-2 text-gray-600 text-gray-600 hover:text-gray-900 hover:text-gray-900 hover:bg-gray-50 hover:bg-gray-50 transition-colors"
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
                        <span className="text-sm font-medium">
                          Back to Chats
                        </span>
                      </button>
                    </div>
                    <ChatView
                      selectedChat={selectedChat}
                      messages={messages}
                      newChatMessage={newChatMessage}
                      setNewChatMessage={setNewChatMessage}
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <MessageDetailModal
        isOpen={isEmailMessageModalOpen}
        onClose={() => setIsEmailMessageModalOpen(false)}
        message={selectedEmailMessage}
        formatDate={formatDate}
      />

      <StartChatModal
        isOpen={showStartChatModal}
        onClose={() => setShowStartChatModal(false)}
        tenants={tenants
          .filter(
            (tenant) =>
              // Only include tenants with valid data
              tenant.first_name && tenant.last_name
          )
          .map((tenant) => ({
            id: tenant.id,
            name: `${tenant.first_name} ${tenant.last_name}`,
            property:
              tenant.property_name ||
              tenant.property?.name ||
              (tenant.unit &&
                tenant.unit.property &&
                tenant.unit.property.name) ||
              tenant.property ||
              "Unknown Property",
            unit:
              tenant.unit_id || (tenant.unit && tenant.unit.unit_id) || "Unit",
            email: tenant.email || "",
          }))}
        onSelectTenant={handleSelectTenant}
      />

      <Modal
        isOpen={showNewMessageModal}
        onClose={() => {
          setShowNewMessageModal(false);
          setNewMessage({
            recipient: "",
            message: "",
          });
          setTenantSearchQuery("");
          setFilteredTenants([]);
        }}
      >
        <NewMessageModal
          isOpen={showNewMessageModal}
          onClose={() => {
            setShowNewMessageModal(false);
            setNewMessage({
              recipient: "",
              message: "",
            });
            setTenantSearchQuery("");
            setFilteredTenants([]);
          }}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          tenantSearchQuery={tenantSearchQuery}
          setTenantSearchQuery={setTenantSearchQuery}
          filteredTenants={filteredTenants}
          onSend={handleSendNewMessage}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => {
          setIsDeleteConfirmModalOpen(false);
          setMessageToDelete(null);
        }}
        onConfirm={handleDeleteMessage}
      />
    </div>
  );
};

export default Messages;
