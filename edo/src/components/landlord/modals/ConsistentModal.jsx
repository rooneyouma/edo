import React from "react";
import Modal from "../../../partials/Modal";

const ConsistentModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "sm:max-w-2xl",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={maxWidth}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </Modal>
  );
};

export default ConsistentModal;
