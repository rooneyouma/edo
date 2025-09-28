import React, { useState, useEffect } from "react";

const VacateNoticeModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  // Mock data for tenant's properties (in a real app, this would come from your API)
  const tenantProperties = [
    { id: 1, name: "Sunset Apartments", unit: "A101" },
    { id: 2, name: "Mountain View Condos", unit: "B202" },
  ];

  const [formData, setFormData] = useState({
    property: tenantProperties.length === 1 ? tenantProperties[0].id : "",
    moveOutDate: "",
    reason: "",
  });

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        property: tenantProperties.length === 1 ? tenantProperties[0].id : "",
        moveOutDate: "",
        reason: "",
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedProperty = tenantProperties.find(
      (p) => p.id === parseInt(formData.property)
    );

    onSubmit({
      property: selectedProperty,
      moveOutDate: formData.moveOutDate,
      reason: formData.reason,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40 flex items-center justify-center">
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white dark:bg-slate-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
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

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                  Submit Vacate Notice
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Please provide the details for your vacate notice.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {tenantProperties.length > 1 && (
                <div>
                  <label
                    htmlFor="property"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Property
                  </label>
                  <select
                    id="property"
                    name="property"
                    value={formData.property}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm py-2 px-3"
                  >
                    <option value="">Select a property</option>
                    {tenantProperties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name} - {property.unit}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label
                  htmlFor="moveOutDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Move-Out Date
                </label>
                <input
                  type="date"
                  id="moveOutDate"
                  name="moveOutDate"
                  value={formData.moveOutDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm py-2 px-3"
                />
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Reason for Vacating
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm py-2 px-3"
                  placeholder="Please provide a detailed reason for vacating..."
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-[#0d9488] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacateNoticeModal;
