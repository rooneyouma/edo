import React from "react";
import Modal from "../../../partials/Modal";

const MessageDetailModal = ({ isOpen, onClose, message, formatDate }) => {
  if (!message) return null;

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
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            🔥 Urgent
          </span>
        );
      case "important":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            ⚠️ Important
          </span>
        );
      default:
        return null;
    }
  };

  const priority = getMessagePriority(message.content);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="w-[95%] max-w-[95vw] sm:max-w-lg"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {message.sender === "tenant"
                  ? "Message from Tenant"
                  : "Message to Tenant"}
              </h3>
              {getPriorityBadge(priority)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(message.timestamp)}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Recipient Information
            </h4>
            <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {message.tenant}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Property
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {message.property} - {message.unit}
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Message Content
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line break-words">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MessageDetailModal;
