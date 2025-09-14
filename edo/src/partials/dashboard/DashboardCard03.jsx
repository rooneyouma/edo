import React from 'react';

function DashboardCard03() {
  // Mock data for maintenance summary
  const maintenanceSummary = {
    totalRequests: 24,
    openRequests: 8,
    inProgress: 6,
    completed: 10,
    averageResponseTime: "2.5h"
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Maintenance Summary</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Current Status</div>
      </div>
      {/* Card content */}
      <div className="grow p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Requests */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{maintenanceSummary.totalRequests}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Requests</div>
          </div>
          {/* Open Requests */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-red-500">{maintenanceSummary.openRequests}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Open Requests</div>
          </div>
          {/* In Progress */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-yellow-500">{maintenanceSummary.inProgress}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
          </div>
          {/* Completed */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-green-500">{maintenanceSummary.completed}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
          </div>
        </div>
        {/* Average Response Time */}
        <div className="mt-4 p-4 bg-[#0d9488]/10 dark:bg-[#0d9488]/10 rounded-xl">
          <div className="text-2xl font-bold text-[#0d9488] dark:text-[#0d9488]">{maintenanceSummary.averageResponseTime}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Average Response Time</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard03;
