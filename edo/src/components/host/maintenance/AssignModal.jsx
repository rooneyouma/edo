import React from 'react';

const getLocalToday = () => {
  const today = new Date();
  // Get local date in YYYY-MM-DD format
  return today.toISOString().split('T')[0];
};

const AssignModal = ({ isOpen, onClose, onAssign, assigneeName, setAssigneeName, assigneePhone, setAssigneePhone, scheduledDate, setScheduledDate }) => {
  if (!isOpen) return null;

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Assign Maintenance Request</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="assigneeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="assigneeName"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-violet-500 focus:outline-none focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            value={assigneeName}
            onChange={(e) => setAssigneeName(e.target.value)}
            placeholder="Enter name"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="assigneePhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="assigneePhone"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-violet-500 focus:outline-none focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            value={assigneePhone}
            onChange={(e) => setAssigneePhone(e.target.value)}
            placeholder="Enter phone number"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Scheduled Date
          </label>
          <input
            type="date"
            id="scheduledDate"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-violet-500 focus:outline-none focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={getLocalToday()}
          />
        </div>
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#0d9488] text-base font-medium text-white hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] sm:text-sm"
          onClick={onAssign}
        >
          Assign
        </button>
      </div>
    </div>
  );
};

export default AssignModal; 