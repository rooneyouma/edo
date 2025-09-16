import React from "react";
import Modal from "../../../partials/Modal";

const TenantDetailModal = ({ tenant, isOpen, onClose }) => {
  if (!tenant || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm:max-w-2xl">
      {/* Added consistent modal container with proper background styling */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Tenant Details
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

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.name}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.email}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Phone
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.phone}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Property
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.property}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Unit Number
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.unit_number}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Rent
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                ${tenant.rent ? tenant.rent.toLocaleString() : "0"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.status}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TenantDetailModal;
