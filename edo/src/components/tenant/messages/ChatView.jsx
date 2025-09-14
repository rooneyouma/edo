import React, { useRef, useEffect } from 'react';

const ChatView = ({
  selectedChat,
  messages,
  newChatMessage,
  setNewChatMessage,
  handleMessageSubmit,
  formatDate
}) => {
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChat]);

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select a chat to start messaging</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose a conversation from the list to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 max-h-[60vh] sm:max-h-[80vh] w-full max-w-full" style={{ minHeight: 0 }}>
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {selectedChat.manager.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {selectedChat.manager.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedChat.propertyName} - {selectedChat.unit}
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(selectedChat.lastMessageTime)}
        </div>
      </div>
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: 'none' }}
      >
        {messages[selectedChat.propertyId]?.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'tenant' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'manager' && (
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {selectedChat.manager.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${message.sender === 'tenant' ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'}`}>
              <div>{message.content}</div>
              <div className="text-xs text-right mt-1 opacity-70">{formatDate(message.timestamp)}</div>
            </div>
            {message.sender === 'tenant' && (
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center order-2">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Me</span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <form onSubmit={handleMessageSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newChatMessage}
            onChange={(e) => setNewChatMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!newChatMessage.trim()}
            className="p-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView; 