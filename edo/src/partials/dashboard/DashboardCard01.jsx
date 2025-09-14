import React from 'react';

function DashboardCard01() {
  // Mock data for property summary
  const propertySummary = {
    totalProperties: 24,
    occupiedProperties: 18,
    vacantProperties: 6,
    maintenanceRequired: 3,
    occupancyRate: 75
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Property Summary</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Current Status</div>
      </div>
      {/* Card content */}
      <div className="grow p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Properties */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{propertySummary.totalProperties}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Properties</div>
          </div>
          {/* Occupied Properties */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-green-500">{propertySummary.occupiedProperties}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Occupied</div>
          </div>
          {/* Vacant Properties */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-red-500">{propertySummary.vacantProperties}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Vacant</div>
          </div>
          {/* Maintenance Required */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-yellow-500">{propertySummary.maintenanceRequired}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Maintenance Required</div>
          </div>
        </div>
        {/* Occupancy Rate */}
        <div className="mt-4 p-4 bg-[#0d9488]/10 dark:bg-[#0d9488]/10 rounded-xl">
          <div className="text-2xl font-bold text-[#0d9488] dark:text-[#0d9488]">{propertySummary.occupancyRate}%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard01;
