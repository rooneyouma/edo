import React from 'react';

const MaintenanceFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  propertyFilter,
  setPropertyFilter,
  dateFilter,
  setDateFilter
}) => {
  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            placeholder="Search maintenance requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex-shrink-0">
          <select
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="flex-shrink-0">
          <select
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="flex-shrink-0">
          <select
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100"
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
          >
            <option value="all">All Properties</option>
            <option value="Sunset Apartments">Sunset Apartments</option>
            <option value="Mountain View Condos">Mountain View Condos</option>
            <option value="Riverside Townhomes">Riverside Townhomes</option>
            <option value="Downtown Lofts">Downtown Lofts</option>
            <option value="Garden Villas">Garden Villas</option>
          </select>
        </div>
        <div className="flex-shrink-0">
          <select
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
      </div>
    </div>
  );
};

export default MaintenanceFilters; 