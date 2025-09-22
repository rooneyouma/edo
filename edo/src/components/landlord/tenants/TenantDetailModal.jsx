import React from "react";
import Modal from "../../../partials/Modal";

const TenantDetailModal = ({ tenant, isOpen, onClose }) => {
  if (!tenant || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm:max-w-2xl">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Tenant Details
            </h3>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.name}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.email}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Phone
              </h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.phone}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Property
              </h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.property}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Unit Number
              </h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.unit_number}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Rent
              </h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                KES {tenant.rent ? tenant.rent.toLocaleString() : "0"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {tenant.status}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
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
