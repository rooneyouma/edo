import React, { useState } from "react";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

const MessageFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  propertyFilter,
  setPropertyFilter,
  dateFilter,
  setDateFilter,
  isSent = false,
  sortOrder,
  setSortOrder,
  availableProperties = [],
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (!isSent && statusFilter !== "all") count++;
    if (propertyFilter !== "all") count++;
    if (dateFilter.startDate || dateFilter.endDate) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

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
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
              activeFiltersCount > 0
                ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-400"
                : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100">
                {activeFiltersCount}
              </span>
            )}
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
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "latest" ? "Latest" : "Earliest"}
          </button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && !isFilterOpen && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Active filters:
          </span>
          {!isSent && statusFilter !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Status: {statusFilter}
            </span>
          )}
          {propertyFilter !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Property: {propertyFilter}
            </span>
          )}
          {(dateFilter.startDate || dateFilter.endDate) && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Date Range
            </span>
          )}
          <button
            onClick={() => {
              if (!isSent) setStatusFilter("all");
              setPropertyFilter("all");
              setDateFilter({ startDate: "", endDate: "" });
            }}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 dark:bg-gray-700 dark:text-gray-100 shadow-sm transition-all duration-200"
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
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 dark:bg-gray-700 dark:text-gray-100 shadow-sm transition-all duration-200"
              >
                <option value="all">All Properties</option>
                {availableProperties.map((property) => (
                  <option key={property} value={property}>
                    {property}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>

              {/* Quick Date Presets */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { label: "Today", days: 0 },
                  { label: "This Week", days: 7 },
                  { label: "This Month", days: 30 },
                  { label: "Last 3 Months", days: 90 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const today = new Date();
                      const startDate = new Date(today);
                      startDate.setDate(today.getDate() - preset.days);

                      setDateFilter({
                        startDate:
                          preset.days === 0
                            ? today.toISOString().split("T")[0]
                            : startDate.toISOString().split("T")[0],
                        endDate: today.toISOString().split("T")[0],
                      });
                    }}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  onClick={() => setDateFilter({ startDate: "", endDate: "" })}
                  className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Custom Date Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
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
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 dark:bg-gray-700 dark:text-gray-100 shadow-sm transition-all duration-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
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
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 dark:bg-gray-700 dark:text-gray-100 shadow-sm transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clear All Filters Button */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  if (!isSent) setStatusFilter("all");
                  setPropertyFilter("all");
                  setDateFilter({ startDate: "", endDate: "" });
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-300 dark:border-red-600 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageFilters;
