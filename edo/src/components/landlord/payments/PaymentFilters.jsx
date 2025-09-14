import React, { useState } from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';

const PaymentFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  propertyFilter,
  setPropertyFilter,
  dateFilter,
  setDateFilter,
  paymentMethodFilter,
  setPaymentMethodFilter,
  sortOrder,
  setSortOrder,
  propertyOptions
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search payments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {isFilterOpen ? (
              <X className="h-4 w-4 ml-2" />
            ) : (
              <span className="ml-2">▼</span>
            )}
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === 'latest' ? 'earliest' : 'latest')}
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === 'latest' ? 'Latest' : 'Earliest'}
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label htmlFor="property" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property
            </label>
            <select
              id="property"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              {propertyOptions.map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <select
              id="date"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentFilters; 