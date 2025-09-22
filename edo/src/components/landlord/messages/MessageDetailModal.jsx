import React from "react";
import Modal from "../../../partials/Modal";

const MessageDetailModal = ({ isOpen, onClose, message, formatDate }) => {
  if (!message) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {message.sender === "tenant"
                ? "Message from Tenant"
                : "Message to Tenant"}
            </h3>
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
            <dl className="mt-2 grid grid-cols-2 gap-4">
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
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MessageDetailModal;
