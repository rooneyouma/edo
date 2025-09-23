"use client";

import React, { useState, useEffect } from "react";
import TenantHeader from "../../../partials/tenant/TenantHeader.jsx";
import TenantSidebar from "../../../partials/tenant/TenantSidebar.jsx";
import { useSearchParams, useRouter } from "next/navigation";
import ChatView from "../../../components/tenant/messages/ChatView.jsx";
import ChatList from "../../../components/tenant/messages/ChatList.jsx";
import { isAuthenticated } from "../../../utils/api.js";
import Link from "next/link";

const Messages = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const managerId = searchParams.get("managerId");
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock data for conversations - This should be replaced with actual API calls
  const [conversations, setConversations] = useState([
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
    },
  ]);

  // Message history state
  const [messageHistory, setMessageHistory] = useState({
    1: [
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
    ],
    2: [
      {
        id: 1,
        sender: "manager",
        content: "Your rent payment has been received. Thank you!",
        timestamp: "2024-02-19T15:45:00",
        read: true,
      },
    ],
  });

  // Handle managerId from URL
  useEffect(() => {
    if (managerId) {
      const conversation = conversations.find(
        (conv) => conv.manager.id === parseInt(managerId)
      );
      if (conversation) {
        setSelectedChat(conversation);
      }
    }
  }, [managerId, conversations]);

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

  // Function to handle sending a message
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    setIsLoading(true);
    try {
      const newMessage = {
        id: Date.now(),
        sender: "tenant",
        content: messageInput.trim(),
        timestamp: new Date().toISOString(),
        read: true,
      };

      // Update message history
      setMessageHistory((prev) => ({
        ...prev,
        [selectedChat.propertyId]: [
          ...(prev[selectedChat.propertyId] || []),
          newMessage,
        ],
      }));

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedChat.id
            ? {
                ...conv,
                lastMessage: newMessage.content,
                lastMessageTime: newMessage.timestamp,
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
      [chat.propertyId]: (prev[chat.propertyId] || []).map((msg) => ({
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

  // Simulate receiving a new manager message (for demonstration)
  // In a real app, this would be triggered by a websocket or polling
  useEffect(() => {
    // Example: Add a new unread manager message to the first conversation after 10 seconds
    const timer = setTimeout(() => {
      setMessageHistory((prev) => ({
        ...prev,
        1: [
          ...(prev[1] || []),
          {
            id: Date.now(),
            sender: "manager",
            content: "This is a new message from your manager.",
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
      }));
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === 1
            ? {
                ...conv,
                unread: true,
                lastMessage: "This is a new message from your manager.",
                lastMessageTime: new Date().toISOString(),
              }
            : conv
        )
      );
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

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
        <Link
          href={`/auth/signin?role=tenant&next=/tenant/messages`}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Proceed to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex">
        <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TenantHeader toggleSidebar={toggleSidebar} />
          {/* Main content */}
          <main className="flex-1 transition-all duration-200">
            <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-2 md:py-8 h-full min-h-0 flex flex-col">
              {/* Page header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Messages
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Communicate with your property managers
                </p>
              </div>

              {/* Messages container */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex-1 min-h-0 flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[65vh] md:h-[80vh] min-h-0">
                  {/* Conversations list */}
                  <div
                    className={`lg:col-span-4 border-r border-slate-200 dark:border-slate-700 ${
                      selectedChat ? "hidden lg:block" : "block"
                    } min-h-0 h-full flex flex-col`}
                  >
                    <div className="h-full flex flex-col min-h-0">
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                          Chats
                        </h2>
                      </div>
                      <ChatList
                        conversations={conversations}
                        selectedChat={selectedChat}
                        onChatSelect={handleChatSelect}
                        formatDate={formatDate}
                      />
                    </div>
                  </div>

                  {/* Chat area */}
                  <div
                    className={`lg:col-span-8 ${
                      selectedChat ? "block" : "hidden lg:block"
                    } min-h-0 h-full flex flex-col`}
                  >
                    <div className="lg:hidden">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="p-4 flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
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
                      messages={messageHistory}
                      newChatMessage={messageInput}
                      setNewChatMessage={setMessageInput}
                      handleMessageSubmit={handleMessageSubmit}
                      formatDate={formatDate}
                    />
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
