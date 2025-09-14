import React, { useState } from 'react';
import { Filter, X, ArrowUpDown } from 'lucide-react';

const MessageFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  propertyFilter,
  setPropertyFilter,
  dateFilter,
  setDateFilter,
  isSent = false,
  sortOrder,
  setSortOrder
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="mb-4">
      {/* Search and Filter Button */}
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            placeholder={`Search ${isSent ? 'sent' : 'received'} messages...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {isFilterOpen && (
            <X className="h-4 w-4 ml-2" />
          )}
        </button>
        <button
          onClick={() => setSortOrder(sortOrder === 'latest' ? 'earliest' : 'latest')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          {sortOrder === 'latest' ? 'Latest' : 'Earliest'}
        </button>
      </div>

      {/* Filter Options */}
      <div className={`grid gap-4 ${isFilterOpen ? 'block' : 'hidden'} sm:grid-cols-2 lg:grid-cols-4`}>
        {!isSent && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        )}

        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="all">All Properties</option>
          <option value="Sunset Apartments">Sunset Apartments</option>
          <option value="Mountain View Condos">Mountain View Condos</option>
          <option value="Riverside Townhomes">Riverside Townhomes</option>
        </select>

        <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-2">
          <input
            type="date"
            value={dateFilter.startDate}
            onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="date"
            value={dateFilter.endDate}
            onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default MessageFilters; 