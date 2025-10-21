import React from "react";

const TenantChatView = ({
  selectedChat,
  messages,
  newChatMessage,
  setNewChatMessage,
  handleMessageSubmit,
  formatDate,
  isSelectionMode,
  selectedMessages,
  toggleMessageSelection,
  startLongPress,
  cancelLongPress,
  deleteSelectedMessages,
  exitSelectionMode,
  isMobile,
}) => {
  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-xs">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            Select a chat to start messaging
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Choose a conversation from the list to view messages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col bg-white w-full max-w-full h-full"
      style={{ minHeight: 0 }}
    >
      {/* Chat Header */}
      <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        {isSelectionMode ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <button
                onClick={exitSelectionMode}
                className="text-slate-600 hover:text-slate-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span className="text-sm font-medium text-slate-900">
                {selectedMessages.length} selected
              </span>
            </div>
            <button
              onClick={deleteSelectedMessages}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {selectedChat.manager.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-slate-900 truncate">
                  {selectedChat.manager.name}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {selectedChat.propertyName} - property manager
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500 max-w-[80px] sm:max-w-[120px] truncate">
              {formatDate(selectedChat.lastMessageTime)}
            </div>
          </>
        )}
      </div>
      {/* Messages */}
      <div
        className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
        style={{ maxHeight: "none" }}
      >
        {(messages[selectedChat.id] || []).map((message) => {
          // Determine if the message was sent by the current tenant
          const isCurrentUserMessage = message.sender === "tenant";
          const isSelected = selectedMessages.includes(message.id);

          return (
            <div
              key={message.id}
              className={`flex ${
                isCurrentUserMessage ? "justify-end" : "justify-start"
              }`}
              onTouchStart={() => isMobile && startLongPress(message.id)}
              onTouchEnd={() => isMobile && cancelLongPress()}
              onTouchMove={() => isMobile && cancelLongPress()}
              onContextMenu={(e) => {
                if (!isMobile) {
                  e.preventDefault();
                  // Use enterSelectionMode or toggleMessageSelection based on current mode
                  if (isSelectionMode) {
                    toggleMessageSelection(message.id);
                  } else {
                    toggleMessageSelection(message.id); // Select the message
                    // If enterSelectionMode function exists, call it
                    if (typeof enterSelectionMode === "function") {
                      enterSelectionMode();
                    }
                  }
                }
              }}
              onClick={() =>
                isSelectionMode && toggleMessageSelection(message.id)
              }
            >
              {isSelectionMode && (
                <div
                  className={`flex items-center justify-center mr-2 ${
                    !isCurrentUserMessage ? "order-0" : "order-3 ml-2"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-300"
                    } flex items-center justify-center`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {!isCurrentUserMessage && (
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mr-2 sm:mr-3 ${
                    isSelectionMode ? "order-1" : "order-0"
                  }`}
                >
                  <span className="text-xs font-medium text-gray-600">
                    {selectedChat.manager.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
              <div
                className={`max-w-[80%] sm:max-w-xs px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
                  isCurrentUserMessage
                    ? "bg-teal-500 text-white"
                    : "bg-slate-200 text-slate-900"
                } ${
                  isSelectionMode
                    ? isCurrentUserMessage
                      ? "order-1"
                      : "order-2"
                    : isCurrentUserMessage
                    ? "order-0"
                    : "order-1"
                }`}
              >
                <div>{message.content}</div>
                <div className="text-xs text-right mt-1 opacity-70">
                  {formatDate(message.timestamp)}
                </div>
              </div>
              {isCurrentUserMessage && (
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 ml-2 sm:ml-3 ${
                    isSelectionMode ? "order-2" : "order-1"
                  }`}
                >
                  <span className="text-xs font-medium text-green-600">Me</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t border-slate-200 flex-shrink-0">
        <form
          onSubmit={handleMessageSubmit}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={newChatMessage}
            onChange={(e) => setNewChatMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 block w-full px-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!newChatMessage.trim()}
            className="p-2 text-teal-600 hover:text-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TenantChatView;
