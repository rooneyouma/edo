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
  const [tenants, setTenants] = useState([]); // Store actual tenants
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    property: "",
    unit: "",
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
            property: tenant.unit?.property?.name || "N/A",
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

  const handleDeleteMessage = () => {
    if (messageToDelete) {
      const [chatId, messageId] = messageToDelete.id.split("-");
      setMessages((prevMessages) =>
        prevMessages.map((chat) => {
          if (chat.id === parseInt(chatId)) {
            return {
              ...chat,
              messages: chat.messages.filter(
                (msg) => msg.id !== parseInt(messageId)
              ),
              lastMessage:
                chat.messages[chat.messages.length - 2]?.content || "",
              lastMessageTime:
                chat.messages[chat.messages.length - 2]?.timestamp || "",
            };
          }
          return chat;
        })
      );
      setIsDeleteConfirmModalOpen(false);
      setMessageToDelete(null);
    }
  };

  // Filter tenants based on search query
  useEffect(() => {
    if (tenantSearchQuery) {
      const filtered = tenants.filter(
        (tenant) =>
          `${tenant.first_name} ${tenant.last_name}`
            .toLowerCase()
            .includes(tenantSearchQuery.toLowerCase()) ||
          tenant.unit?.property?.name
            ?.toLowerCase()
            .includes(tenantSearchQuery.toLowerCase()) ||
          tenant.unit?.unit_id
            ?.toLowerCase()
            .includes(tenantSearchQuery.toLowerCase())
      );
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
      // Send message to backend
      const messageData = {
        recipient: parseInt(newMessage.recipient),
        message: newMessage.message,
        // Add property and unit if available
        property: newMessage.property ? parseInt(newMessage.property) : null,
        unit: newMessage.unit ? parseInt(newMessage.unit) : null,
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
              property: tenant.unit?.property?.name || "N/A",
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

      setShowNewMessageModal(false);
      setNewMessage({
        recipient: "",
        property: "",
        unit: "",
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
        message: newChatMessage.trim(),
        property: selectedChat.property
          ? parseInt(selectedChat.property)
          : null,
        unit: selectedChat.unit ? parseInt(selectedChat.unit) : null,
      };

      const response = await chatAPI.sendMessage(messageData);

      const newMessage = {
        id: response.id,
        sender: "landlord", // Explicitly set sender as landlord for the landlord's view
        content: newChatMessage.trim(),
        timestamp: response.timestamp,
      };

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
        tenant: `${tenant.first_name} ${tenant.last_name}`,
        tenantEmail: tenant.email,
        property: tenant.unit?.property?.name || "N/A",
        unit: tenant.unit?.unit_id || "N/A",
        messages: [],
        lastMessage: "",
        lastMessageTime: "",
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
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
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        <Header toggleSidebar={toggleSidebar} />

        <main className="grow">
          <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-8 w-full">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex-auto">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6 text-[#0d9488]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Messages
                  </h1>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center space-x-4">
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("email")}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-md border ${
                      viewMode === "email"
                        ? "bg-[#0d9488] text-white border-[#0d9488]"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    Email View
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("chat")}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md border ${
                      viewMode === "chat"
                        ? "bg-[#0d9488] text-white border-[#0d9488]"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    Chat View
                  </button>
                </div>
                <button
                  onClick={() => setShowNewMessageModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                >
                  New Message
                </button>
              </div>
            </div>

            {viewMode === "email" ? (
              <>
                {/* Horizontal Status Menu for Received/Sent */}
                <div className="border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto sm:overflow-x-visible">
                  <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
                    <button
                      onClick={() => setMessageTab("received")}
                      className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                        messageTab === "received"
                          ? "border-teal-500 text-teal-600 dark:text-teal-400"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      Received
                    </button>
                    <button
                      onClick={() => setMessageTab("sent")}
                      className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                        messageTab === "sent"
                          ? "border-teal-500 text-teal-600 dark:text-teal-400"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      Sent
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
                    />
                    <MessageTable
                      messages={currentReceivedMessages}
                      onMessageClick={handleEmailMessageClick}
                      onDeleteClick={(message) => {
                        setMessageToDelete(message);
                        setIsDeleteConfirmModalOpen(true);
                      }}
                      formatDate={formatDate}
                    />
                    {/* Received Messages Pagination */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-700 dark:text-gray-200">
                            Page {currentReceivedPage} of {totalReceivedPages}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-700 dark:text-gray-200">
                              Go to page:
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
                              className="w-12 h-6 text-xs text-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleReceivedPageChange(currentReceivedPage - 1)
                            }
                            disabled={currentReceivedPage === 1}
                            className="inline-flex items-center p-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            disabled={
                              currentReceivedPage === totalReceivedPages
                            }
                            className="inline-flex items-center p-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    />
                    <MessageTable
                      messages={currentSentMessages}
                      onMessageClick={handleEmailMessageClick}
                      onDeleteClick={(message) => {
                        setMessageToDelete(message);
                        setIsDeleteConfirmModalOpen(true);
                      }}
                      formatDate={formatDate}
                    />
                    {/* Sent Messages Pagination */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-700 dark:text-gray-200">
                            Page {currentSentPage} of {totalSentPages}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-700 dark:text-gray-200">
                              Go to page:
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
                              className="w-12 h-6 text-xs text-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleSentPageChange(currentSentPage - 1)
                            }
                            disabled={currentSentPage === 1}
                            className="inline-flex items-center p-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="inline-flex items-center p-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="mt-8 h-[calc(100vh-12rem)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
                  <div
                    className={`lg:col-span-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
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
                    className={`lg:col-span-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
                      selectedChat ? "block" : "hidden lg:block"
                    }`}
                  >
                    <div className="lg:hidden">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="p-4 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
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
                        <span>Back to Chats</span>
                      </button>
                    </div>
                    <ChatView
                      selectedChat={selectedChat}
                      messages={messages}
                      newChatMessage={newChatMessage}
                      setNewChatMessage={setNewChatMessage}
                      handleMessageSubmit={handleMessageSubmit}
                      formatDate={formatDate}
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
        tenants={tenants} // Pass actual tenants instead of mock data
        onSelectTenant={handleSelectTenant}
      />

      <Modal
        isOpen={showNewMessageModal}
        onClose={() => {
          setShowNewMessageModal(false);
          setNewMessage({
            recipient: "",
            property: "",
            unit: "",
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
              property: "",
              unit: "",
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
