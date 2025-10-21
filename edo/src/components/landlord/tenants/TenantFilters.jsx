import React, { useState } from "react";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";

const TenantFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  propertyFilter,
  setPropertyFilter,
  sortOrder,
  setSortOrder,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  // Get display name for status filter
  const getStatusDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Status";
    return filterValue;
  };

  // Get display name for property filter
  const getPropertyDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Properties";
    return filterValue;
  };

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Inactive", label: "Inactive" },
  ];

  // Property options
  const propertyOptions = [
    { value: "all", label: "All Properties" },
    { value: "Sunset Apartments", label: "Sunset Apartments" },
    { value: "Mountain View Condos", label: "Mountain View Condos" },
    { value: "Riverside Townhomes", label: "Riverside Townhomes" },
    { value: "Downtown Lofts", label: "Downtown Lofts" },
    { value: "Garden Villas", label: "Garden Villas" },
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tenants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="hidden sm:block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 shadow-sm transition-all duration-200"
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

          {/* Property Filter - Custom Dropdown for Mobile */}
          <div className="relative">
            <label
              htmlFor="property"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property
            </label>
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() =>
                  setIsPropertyDropdownOpen(!isPropertyDropdownOpen)
                }
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-4 py-2"
                title="Filter by property"
              >
                <span className="truncate">
                  {getPropertyDisplayName(propertyFilter)}
                </span>
                <Filter className="h-5 w-5 ml-2 flex-shrink-0" />
              </button>
              {isPropertyDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {propertyOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          propertyFilter === option.value
                            ? "text-teal-600 bg-teal-50 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setPropertyFilter(option.value);
                          setIsPropertyDropdownOpen(false);
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
              id="property"
              className="hidden sm:block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 shadow-sm transition-all duration-200"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              {propertyOptions.map((option) => (
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

export default TenantFilters;
