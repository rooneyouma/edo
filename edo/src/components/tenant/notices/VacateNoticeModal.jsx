import React, { useState, useEffect } from "react";

const VacateNoticeModal = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  tenantProperties = [],
}) => {
  const [formData, setFormData] = useState({
    property: tenantProperties.length === 1 ? tenantProperties[0].id : "",
    moveOutDate: "",
    reason: "",
  });
  const [formError, setFormError] = useState("");
  const [lastSubmissionTime, setLastSubmissionTime] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        property: tenantProperties.length === 1 ? tenantProperties[0].id : "",
        moveOutDate: "",
        reason: "",
      });
      // Clear any form error when reopening
      setFormError("");
    }
  }, [isOpen, tenantProperties]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateSubmission = (
    formData,
    tenantProperties,
    vacateRequests = []
  ) => {
    const now = new Date();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Clear any previous form error
    setFormError("");

    // Check if there's an existing pending request
    const hasPendingRequest = vacateRequests.some(
      (request) => request.status.toLowerCase() === "pending"
    );

    if (hasPendingRequest) {
      setFormError(
        "You already have a pending vacate request. Please wait for it to be processed or withdraw it before submitting a new one."
      );
      return false;
    }

    // Check submission frequency
    if (lastSubmissionTime) {
      const timeSinceLastSubmission = now - new Date(lastSubmissionTime);

      // Prevent more than 3 submissions in 24 hours
      if (submissionCount >= 3 && timeSinceLastSubmission < twentyFourHours) {
        setFormError(
          "You have reached the maximum number of submissions for today. Please try again tomorrow."
        );
        return false;
      }

      // Reset submission count after 24 hours
      if (timeSinceLastSubmission >= twentyFourHours) {
        setSubmissionCount(0);
      }
    }

    // Validate move-out date
    const moveOutDate = new Date(formData.moveOutDate);
    const minimumNotice = 30; // days
    const today = new Date();

    if (moveOutDate < today) {
      setFormError("Move-out date cannot be in the past.");
      return false;
    }

    const daysNotice = Math.ceil((moveOutDate - today) / (1000 * 60 * 60 * 24));
    if (daysNotice < minimumNotice) {
      setFormError(
        `Please provide at least ${minimumNotice} days notice for moving out.`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the submission
    if (!validateSubmission(formData, tenantProperties)) {
      return;
    }

    const selectedProperty = tenantProperties.find(
      (p) => p.id === parseInt(formData.property)
    );

    if (!selectedProperty) {
      setFormError("Selected property not found");
      return;
    }

    // Update submission tracking
    setSubmissionCount((prev) => prev + 1);
    setLastSubmissionTime(new Date().toISOString());

    onSubmit({
      move_out_date: formData.moveOutDate,
      reason: formData.reason,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 z-40">
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 w-full">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => {
                  onClose();
                  setFormError(""); // Clear error when closing
                }}
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
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Submit Vacate Notice
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please provide the details for your vacate notice.
                </p>
              </div>
            </div>

            {/* Add 30-day notice badge inside the form modal */}
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <svg
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Minimum 30 days notice required
              </span>
            </div>

            {/* Form validation error message */}
            {formError && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{formError}</p>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
            >
              {tenantProperties.length > 1 && (
                <div>
                  <label
                    htmlFor="property"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Property
                  </label>
                  <select
                    id="property"
                    name="property"
                    value={formData.property}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] text-sm sm:text-sm py-2 px-3"
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
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] text-sm sm:text-sm py-2 px-3"
                />
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason for Vacating (Optional)
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] text-sm sm:text-sm py-2 px-3"
                  placeholder="Please provide a detailed reason for vacating..."
                />
              </div>

              <div className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2"
                  onClick={() => {
                    onClose();
                    setFormError(""); // Clear error when closing
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent bg-[#0d9488] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2"
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
