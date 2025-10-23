import React from "react";
import CustomSelect from "../../ui/CustomSelect";

const StatusModal = ({
  isOpen,
  onClose,
  onUpdate,
  selectedStatus,
  setSelectedStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/30 transition-opacity">
      <div
        className="fixed inset-0 z-60 overflow-y-auto"
        style={{ zIndex: 1060 }}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select New Status
                  </label>
                  <CustomSelect
                    id="status"
                    label="Select New Status"
                    options={[
                      { value: "", label: "Select a status" },
                      { value: "Pending", label: "Pending" },
                      { value: "In Progress", label: "In Progress" },
                      { value: "Completed", label: "Completed" },
                    ]}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:text-sm"
                  onClick={onUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
