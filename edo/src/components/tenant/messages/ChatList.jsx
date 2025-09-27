import React from "react";

const ChatList = ({
  conversations,
  selectedChat,
  onChatSelect,
  formatDate,
  hasRentals,
  searchQuery,
  onSearchChange,
}) => {
  // Filter conversations based on search query
  const filteredConversations = conversations.filter((chat) => {
    // If no search query, show all conversations
    if (!searchQuery) {
      return true;
    }

    // If there is a search query, filter by property name, manager name, or message content
    return (
      (chat.propertyName &&
        chat.propertyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (chat.manager &&
        chat.manager.name &&
        chat.manager.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (chat.lastMessage &&
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header with title and search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Chats
        </h2>
        {/* Search input */}
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={onSearchChange}
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

      {/* Chat list content */}
      <div className="flex-1 overflow-y-auto">
        {!hasRentals ? (
          // No property managers section
          <div className="p-4 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No property managers
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              You are not registered under any rental properties.
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Once you are assigned to a property, you can communicate with your
              property managers here.
            </p>
          </div>
        ) : (
          // Chat list with properties
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.map((chat) => (
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
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {chat.manager && chat.manager.name
                              ? chat.manager.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "M"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {chat.propertyName || "Property"}
                          </p>
                          {chat.lastMessageTime && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                              {formatDate(chat.lastMessageTime)}
                            </p>
                          )}
                        </div>
                        {/* Show property manager name instead of hardcoded text */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {chat.manager && chat.manager.name
                            ? `${chat.manager.name} - property manager`
                            : "Property Manager"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                          {chat.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {chat.unread && (
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0d9488] text-white">
                        New
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
            {filteredConversations.length === 0 && searchQuery && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No chats found matching "{searchQuery}"
              </div>
            )}
            {filteredConversations.length === 0 &&
              !searchQuery &&
              hasRentals &&
              conversations.length === 0 && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No conversations yet.
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
