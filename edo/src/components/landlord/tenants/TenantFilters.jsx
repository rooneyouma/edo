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

  // Get display names for current filters
  const getStatusDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Status";
    return filterValue;
  };

  const getPropertyDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Properties";
    return filterValue;
  };

  // Options for dropdowns
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Inactive", label: "Inactive" },
  ];

  const propertyOptions = [
    { value: "all", label: "All Properties" },
    { value: "Sunset Apartments", label: "Sunset Apartments" },
    { value: "Mountain View Condos", label: "Mountain View Condos" },
    { value: "Riverside Townhomes", label: "Riverside Townhomes" },
    { value: "Downtown Lofts", label: "Downtown Lofts" },
    { value: "Garden Villas", label: "Garden Villas" },
  ];

  // Close all dropdowns when filter panel is closed
  const closeFilterPanel = () => {
    setIsFilterOpen(false);
    setIsStatusDropdownOpen(false);
    setIsPropertyDropdownOpen(false);
  };

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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {isFilterOpen ? (
                <X className="h-4 w-4 ml-2" />
              ) : (
                <span className="ml-2">▼</span>
              )}
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 left-0 sm:left-auto sm:right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          onClick={() => {
                            setIsStatusDropdownOpen(!isStatusDropdownOpen);
                            setIsPropertyDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-3 py-2 text-sm"
                        >
                          <span className="truncate">{getStatusDisplayName(statusFilter)}</span>
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {isStatusDropdownOpen && (
                          <div className="absolute left-0 right-0 mt-1 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                            <div className="py-1">
                              {statusOptions.map((option) => (
                                <button
                                  key={option.value}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    statusFilter === option.value
                                      ? "text-[#0d9488] bg-[#f0fdfa] font-medium"
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
                        className="hidden sm:block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900"
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
                          onClick={() => {
                            setIsPropertyDropdownOpen(!isPropertyDropdownOpen);
                            setIsStatusDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-3 py-2 text-sm"
                        >
                          <span className="truncate">{getPropertyDisplayName(propertyFilter)}</span>
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {isPropertyDropdownOpen && (
                          <div className="absolute left-0 right-0 mt-1 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                            <div className="py-1 max-h-60 overflow-y-auto">
                              {propertyOptions.map((option) => (
                                <button
                                  key={option.value}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    propertyFilter === option.value
                                      ? "text-[#0d9488] bg-[#f0fdfa] font-medium"
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
                        className="hidden sm:block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900"
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
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={closeFilterPanel}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() =>
              setSortOrder(sortOrder === "latest" ? "earliest" : "latest")
            }
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "latest" ? "Latest" : "Earliest"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantFilters;