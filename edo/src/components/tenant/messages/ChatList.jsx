import React from 'react';

const ChatList = ({
  conversations,
  selectedChat,
  onChatSelect,
  formatDate
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {conversations.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
              selectedChat?.id === chat.id
                ? 'bg-gray-50 dark:bg-gray-800/50'
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {chat.manager.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {chat.manager.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(chat.lastMessageTime)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {chat.propertyName} - {chat.unit}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
              {chat.unread && (
                <div className="ml-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#0d9488]/10 text-[#0d9488] dark:bg-[#0d9488]/30 dark:text-[#0d9488]">
                    New
                  </span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatList; 