import React from 'react';

function DashboardCard02() {
  // Mock data for tenant summary
  const tenantSummary = {
    totalTenants: 144,
    activeTenants: 132,
    pendingTenants: 8,
    inactiveTenants: 4,
    occupancyRate: 91.7
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Tenant Summary</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Current Status</div>
      </div>
      {/* Card content */}
      <div className="grow p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Tenants */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{tenantSummary.totalTenants}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Tenants</div>
          </div>
          {/* Active Tenants */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-green-500">{tenantSummary.activeTenants}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Tenants</div>
          </div>
          {/* Pending Tenants */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-yellow-500">{tenantSummary.pendingTenants}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Pending Tenants</div>
          </div>
          {/* Inactive Tenants */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-2xl font-bold text-red-500">{tenantSummary.inactiveTenants}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Inactive Tenants</div>
          </div>
        </div>
        {/* Occupancy Rate */}
        <div className="mt-4 p-4 bg-[#0d9488]/10 dark:bg-[#0d9488]/10 rounded-xl">
          <div className="text-2xl font-bold text-[#0d9488] dark:text-[#0d9488]">{tenantSummary.occupancyRate}%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard02;
