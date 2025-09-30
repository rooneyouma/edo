import React, { useRef, useEffect, useState } from "react";

const NewMessageModal = ({
  isOpen,
  onClose,
  onSend,
  newMessage,
  setNewMessage,
  tenantSearchQuery,
  setTenantSearchQuery,
  filteredTenants,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const formRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "recipient") {
      setTenantSearchQuery(value);
      setShowDropdown(true);
    }
  };

  const handleTenantSelect = (tenant) => {
    setNewMessage({
      ...newMessage,
      recipient: tenant.id, // Store tenant ID
    });
    setTenantSearchQuery(tenant.name);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.recipient || !newMessage.message) {
      return;
    }
    onSend();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 flex items-center justify-center p-4 z-40"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[95%] max-w-[95vw] sm:max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Send New Message
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
        </div>

        <form
          ref={formRef}
          id="new-message-form"
          onSubmit={handleSubmit}
          className="px-6 pb-6 flex-grow overflow-y-auto"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="recipient"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Recipient
              </label>
              <div className="mt-1 relative" ref={dropdownRef}>
                <input
                  type="text"
                  id="recipient"
                  name="recipient"
                  value={tenantSearchQuery}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                  placeholder="Search by name, email, or unit..."
                  required
                />
                {showDropdown &&
                  tenantSearchQuery &&
                  filteredTenants.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                      {filteredTenants.map((tenant) => (
                        <button
                          key={tenant.id}
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleTenantSelect(tenant)}
                        >
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {tenant.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {tenant.email}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {tenant.property}{" "}
                            {tenant.unit &&
                              tenant.unit !== "N/A" &&
                              `- Unit ${tenant.unit}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={newMessage.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                required
              />
            </div>
          </div>
        </form>

        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-message-form"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
