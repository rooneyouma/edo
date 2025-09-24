import React, { useState } from "react";

const ChatList = ({
  messages,
  selectedChat,
  onChatSelect,
  formatDate,
  onStartNewChat,
  mockTenants,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter messages based on search query
  const filteredMessages = messages.filter(
    (chat) =>
      chat.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header with title, search, and start chat button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Chats
          </h2>
          <button
            onClick={onStartNewChat}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Start Chat
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
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
          </div>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredMessages.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                selectedChat?.id === chat.id
                  ? "bg-gray-50 dark:bg-gray-800/50"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {chat.tenant.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {chat.tenant}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(chat.lastMessageTime)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {chat.property} - {chat.unit}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
                {chat.unread && (
                  <div className="ml-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400">
                      New
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
          {filteredMessages.length === 0 && searchQuery && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No conversations found matching "{searchQuery}"
            </div>
          )}
          {filteredMessages.length === 0 && !searchQuery && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No conversations yet. Start a new chat!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
