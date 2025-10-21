import React, { useState } from "react";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";

const TenantMaintenanceFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortOrder,
  setSortOrder,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

  // Get display name for status filter
  const getStatusDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Status";
    return filterValue;
  };

  // Get display name for priority filter
  const getPriorityDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Priority";
    return filterValue;
  };

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Priority options
  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "emergency", label: "Emergency" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 sm:text-sm shadow-sm transition-all duration-200 text-sm"
            placeholder="Search maintenance requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
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
            onClick={() =>
              setSortOrder(sortOrder === "latest" ? "earliest" : "latest")
            }
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "latest" ? "Latest" : "Earliest"}
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Status Filter - Custom Dropdown for Mobile */}
          <div className="relative">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-4 py-2"
                title="Filter by status"
              >
                <span className="truncate">
                  {getStatusDisplayName(statusFilter)}
                </span>
                <Filter className="h-5 w-5 ml-2 flex-shrink-0" />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          statusFilter === option.value
                            ? "text-teal-600 bg-teal-50 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <select
              id="status"
              className="hidden sm:block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 shadow-sm transition-all duration-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter - Custom Dropdown for Mobile */}
          <div className="relative">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() =>
                  setIsPriorityDropdownOpen(!isPriorityDropdownOpen)
                }
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-4 py-2"
                title="Filter by priority"
              >
                <span className="truncate">
                  {getPriorityDisplayName(priorityFilter)}
                </span>
                <Filter className="h-5 w-5 ml-2 flex-shrink-0" />
              </button>
              {isPriorityDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          priorityFilter === option.value
                            ? "text-teal-600 bg-teal-50 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setPriorityFilter(option.value);
                          setIsPriorityDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <select
              id="priority"
              className="hidden sm:block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 shadow-sm transition-all duration-200"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantMaintenanceFilters;
