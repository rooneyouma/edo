import React, { useState } from "react";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";

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
  setSortOrder,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="mt-4">
      {/* Search and Filter Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-10 pr-4 py-2 focus:border-violet-500 focus:ring-violet-500 focus:ring-2 focus:ring-opacity-20 dark:bg-gray-800 dark:text-gray-100 sm:text-sm shadow-sm transition-all duration-200"
            placeholder={`Search ${isSent ? "sent" : "received"} messages...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {isFilterOpen ? (
              <X className="h-4 w-4 ml-2" />
            ) : (
              <span className="ml-2">▼</span>
            )}
          </button>
          <button
            onClick={() =>
              setSortOrder(sortOrder === "latest" ? "earliest" : "latest")
            }
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "latest" ? "Latest" : "Earliest"}
          </button>
        </div>
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {!isSent && (
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 focus:ring-2 focus:ring-opacity-20 dark:bg-gray-700 dark:text-gray-100 shadow-sm transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="property"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Property
            </label>
            <select
              id="property"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 focus:ring-2 focus:ring-opacity-20 dark:bg-gray-700 dark:text-gray-100 shadow-sm transition-all duration-200"
            >
              <option value="all">All Properties</option>
              <option value="Sunset Apartments">Sunset Apartments</option>
              <option value="Mountain View Condos">Mountain View Condos</option>
              <option value="Riverside Townhomes">Riverside Townhomes</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-2">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={dateFilter.startDate}
                onChange={(e) =>
                  setDateFilter((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 focus:ring-2 focus:ring-opacity-20 dark:bg-gray-700 dark:text-gray-100 shadow-sm transition-all duration-200"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={dateFilter.endDate}
                onChange={(e) =>
                  setDateFilter((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 focus:ring-2 focus:ring-opacity-20 dark:bg-gray-700 dark:text-gray-100 shadow-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageFilters;
