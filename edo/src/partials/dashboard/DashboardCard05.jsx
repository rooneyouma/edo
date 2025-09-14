import React from 'react';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard05() {
  // Mock data for payment statistics
  const paymentStats = {
    currentMonth: {
      totalRent: 110000,
      collected: 100000,
      pending: 8000,
      overdue: 2000,
      collectionRate: 90.9
    },
    lastMonth: {
      totalRent: 105000,
      collected: 98000,
      pending: 5000,
      overdue: 2000,
      collectionRate: 93.3
    }
  };

  // Chart data for monthly income trend
  const chartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Monthly Income',
        data: [
          95000, 98000, 102000, 105000, 108000, 110000,
          105000, 110000, 115000, 110000, 108000, 110000
        ],
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity('#0d9488', 0) },
            { stop: 1, color: adjustColorOpacity('#0d9488', 0.2) }
          ]);
        },
        borderColor: '#0d9488',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: '#0d9488',
        pointHoverBackgroundColor: '#0d9488',
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Payment Rate & Income Statistics</h2>
      </header>
      <div className="p-3">
        {/* Current Month Stats */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Current Month</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Rent</div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">${paymentStats.currentMonth.totalRent.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400">Collected</div>
              <div className="text-base font-semibold text-green-500">${paymentStats.currentMonth.collected.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
              <div className="text-base font-semibold text-yellow-500">${paymentStats.currentMonth.pending.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400">Overdue</div>
              <div className="text-base font-semibold text-red-500">${paymentStats.currentMonth.overdue.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2 p-2 bg-[#0d9488]/10 dark:bg-[#0d9488]/10 rounded">
            <div className="text-xs text-gray-500 dark:text-gray-400">Collection Rate</div>
            <div className="text-base font-semibold text-[#0d9488]">{paymentStats.currentMonth.collectionRate}%</div>
          </div>
        </div>

        {/* Last Month Stats */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Last Month</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Rent</div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">${paymentStats.lastMonth.totalRent.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400">Collected</div>
              <div className="text-base font-semibold text-green-500">${paymentStats.lastMonth.collected.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
              <div className="text-base font-semibold text-yellow-500">${paymentStats.lastMonth.pending.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400">Overdue</div>
              <div className="text-base font-semibold text-red-500">${paymentStats.lastMonth.overdue.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2 p-2 bg-[#0d9488]/10 dark:bg-[#0d9488]/10 rounded">
            <div className="text-xs text-gray-500 dark:text-gray-400">Collection Rate</div>
            <div className="text-base font-semibold text-[#0d9488]">{paymentStats.lastMonth.collectionRate}%</div>
          </div>
        </div>

        {/* Monthly Income Trend Chart */}
        <div className="h-32">
          <LineChart data={chartData} width={595} height={128} />
        </div>
      </div>
    </div>
  );
}

export default DashboardCard05;
