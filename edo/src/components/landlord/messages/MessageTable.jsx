import React from "react";

const MessageTable = ({
  messages,
  onMessageClick,
  onDeleteClick,
  formatDate,
  isSent = false,
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
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            🔥 Urgent
          </span>
        );
      case "important":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            ⚠️ Important
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {messages.map((message) => {
          const priority = getMessagePriority(message.content);
          return (
            <div
              key={message.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                priority === "urgent"
                  ? "border-red-300 dark:border-red-600"
                  : priority === "important"
                  ? "border-orange-300 dark:border-orange-600"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => onMessageClick(message)}
            >
              {/* Card Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {isSent
                        ? `To: ${message.tenant}`
                        : `From: ${message.tenant}`}
                    </h3>
                    {getPriorityBadge(priority)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {message.property} - {message.unit}
                  </p>
                </div>
                {!isSent && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      message.status === "unread"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
                    <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-3">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDate(message.timestamp)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(message);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
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
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                  >
                    {isSent ? "To" : "From"}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Date
                  </th>
                  {!isSent && (
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Status
                    </th>
                  )}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {messages.map((message) => {
                  const priority = getMessagePriority(message.content);
                  return (
                    <tr
                      key={message.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                        priority === "urgent"
                          ? "bg-red-50 dark:bg-red-900/10"
                          : priority === "important"
                          ? "bg-orange-50 dark:bg-orange-900/10"
                          : ""
                      }`}
                      onClick={() => onMessageClick(message)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                        {message.tenant}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {message.property} - {message.unit}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="max-w-md truncate">
                            {message.content}
                          </div>
                          {getPriorityBadge(priority)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(message.timestamp)}
                      </td>
                      {!isSent && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              message.status === "unread"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
