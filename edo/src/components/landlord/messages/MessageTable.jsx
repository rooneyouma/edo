import React from "react";

const MessageTable = ({
  messages,
  onMessageClick,
  onDeleteClick,
  formatDate,
  isSent = false,
  isSelectionMode = false,
  selectedMessages = [],
  toggleMessageSelection,
  enterSelectionMode,
  exitSelectionMode,
  deleteSelectedMessages,
}) => {
  // Helper function to determine message priority based on keywords
  const getMessagePriority = (content) => {
    const urgentKeywords = [
      "urgent",
      "emergency",
      "asap",
      "immediately",
      "critical",
      "broken",
      "leak",
      "fire",
      "flood",
    ];
    const importantKeywords = [
      "important",
      "soon",
      "repair",
      "maintenance",
      "issue",
      "problem",
    ];

    const lowerContent = content.toLowerCase();

    if (urgentKeywords.some((keyword) => lowerContent.includes(keyword))) {
      return "urgent";
    } else if (
      importantKeywords.some((keyword) => lowerContent.includes(keyword))
    ) {
      return "important";
    }
    return "normal";
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            🔥 Urgent
          </span>
        );
      case "important":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            ⚠️ Important
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      {/* Selection Mode Header */}
      {isSelectionMode && (
        <div className="bg-white p-3 mb-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={exitSelectionMode}
              className="text-gray-600 hover:text-gray-900"
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
            <span className="text-sm font-medium text-gray-900">
              {selectedMessages.length} selected
            </span>
          </div>
          <button
            onClick={deleteSelectedMessages}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            disabled={selectedMessages.length === 0}
          >
            Delete
          </button>
        </div>
      )}

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {messages.map((message) => {
          const priority = getMessagePriority(message.content);
          const isSelected = selectedMessages.includes(message.id);

          return (
            <div
              key={message.id}
              className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : priority === "urgent"
                  ? "border-red-300"
                  : priority === "important"
                  ? "border-orange-300"
                  : "border-gray-200"
              }`}
              onClick={(e) => {
                if (isSelectionMode) {
                  toggleMessageSelection(message.id);
                } else {
                  // Long press (right click) to enter selection mode
                  if (e.type === "contextmenu") {
                    e.preventDefault();
                    enterSelectionMode(message.id);
                  } else {
                    onMessageClick(message);
                  }
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                if (!isSelectionMode) {
                  enterSelectionMode(message.id);
                } else {
                  toggleMessageSelection(message.id);
                }
              }}
            >
              {/* Card Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {isSelectionMode && (
                      <div
                        className="flex items-center mr-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleMessageSelection(message.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    )}
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {isSent
                        ? `To: ${message.tenant}`
                        : `From: ${message.tenant}`}
                    </h3>
                    {getPriorityBadge(priority)}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {message.property} - {message.unit}
                  </p>
                </div>
                {!isSent && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      message.status === "unread"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {message.status}
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="px-4 py-3">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-900 line-clamp-3">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(message.timestamp)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(message);
                      }}
                      className="text-red-600 hover:text-red-900 p-1"
                      aria-label="Delete message"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-gray-200 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isSelectionMode && (
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-10"
                    >
                      <span className="sr-only">Select</span>
                    </th>
                  )}
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    {isSent ? "To" : "From"}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date
                  </th>
                  {!isSent && (
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                  )}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {messages.map((message) => {
                  const priority = getMessagePriority(message.content);
                  const isSelected = selectedMessages.includes(message.id);
                  return (
                    <tr
                      key={message.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        isSelected
                          ? "bg-blue-50"
                          : priority === "urgent"
                          ? "bg-red-50"
                          : priority === "important"
                          ? "bg-orange-50"
                          : ""
                      }`}
                      onClick={(e) => {
                        if (isSelectionMode) {
                          toggleMessageSelection(message.id);
                        } else {
                          onMessageClick(message);
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (!isSelectionMode) {
                          enterSelectionMode(message.id);
                        } else {
                          toggleMessageSelection(message.id);
                        }
                      }}
                    >
                      {isSelectionMode && (
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleMessageSelection(message.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                      )}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {message.tenant}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {message.property} - {message.unit}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="max-w-md truncate">
                            {message.content}
                          </div>
                          {getPriorityBadge(priority)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(message.timestamp)}
                      </td>
                      {!isSent && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              message.status === "unread"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {message.status}
                          </span>
                        </td>
                      )}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(message);
                          }}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete message"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageTable;
