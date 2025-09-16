import React, { useEffect, useState } from "react";
import Modal from "../../../partials/Modal";

const AssignModal = ({
  isOpen,
  onClose,
  onAssign,
  request,
  updating = false,
}) => {
  const [assigneeName, setAssigneeName] = useState("");
  const [assigneePhone, setAssigneePhone] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (request) {
      setAssigneeName(request.assignedTo || "");
      setAssigneePhone(request.contact || "");
    }
  }, [request]);

  const validatePhone = (phone) => {
    // Basic phone validation: must be 7-20 digits, can include +, -, spaces
    const phonePattern = /^[\d\+\-\s]{7,20}$/;
    return phonePattern.test(phone);
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setAssigneePhone(phone);

    // Clear error when user starts typing
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleAssign = () => {
    const newErrors = {};

    if (!assigneeName.trim()) {
      newErrors.name = "Name is required";
    }

    if (!assigneePhone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(assigneePhone)) {
      newErrors.phone =
        "Please enter a valid phone number (7-20 digits, may include +, - or spaces)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const assignmentData = {
      assignee_name: assigneeName,
      assignee_phone: assigneePhone,
    };

    console.log("Sending assignment data:", assignmentData);
    console.log("Request ID:", request.id);
    console.log("Request object:", request);

    onAssign(request.id, assignmentData);

    // Clear form fields and close modal
    setAssigneeName("");
    setAssigneePhone("");
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Added consistent modal container with proper background styling */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 w-full">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Assign Maintenance Request
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="assigneeName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="assigneeName"
                className={`mt-1 block w-full rounded-md border py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 sm:text-sm ${
                  errors.name
                    ? "border-red-500 focus:border-red-600 focus:ring-red-500 dark:border-red-400 dark:bg-gray-700 dark:text-gray-100"
                    : "border-teal-500 dark:border-teal-400 focus:border-teal-600 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100"
                }`}
                value={assigneeName}
                onChange={(e) => {
                  setAssigneeName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
                placeholder="Enter name"
                autoComplete="off"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="assigneePhone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="assigneePhone"
                className={`mt-1 block w-full rounded-md border py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 sm:text-sm ${
                  errors.phone
                    ? "border-red-500 focus:border-red-600 focus:ring-red-500 dark:border-red-400 dark:bg-gray-700 dark:text-gray-100"
                    : "border-teal-500 dark:border-teal-400 focus:border-teal-600 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100"
                }`}
                value={assigneePhone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                autoComplete="off"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              disabled={updating}
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAssign}
            >
              {updating ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AssignModal;
