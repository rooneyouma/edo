import React, { useState } from "react";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";

const NoticeFilters = ({
  searchQuery,
  setSearchQuery,
  noticeTypeFilter,
  setNoticeTypeFilter,
  audienceFilter,
  setAudienceFilter,
  sortOrder,
  setSortOrder,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNoticeTypeDropdownOpen, setIsNoticeTypeDropdownOpen] =
    useState(false);
  const [isAudienceDropdownOpen, setIsAudienceDropdownOpen] = useState(false);

  // Get display name for notice type filter
  const getNoticeTypeDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Types";
    return filterValue;
  };

  // Get display name for audience filter
  const getAudienceDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Audiences";
    return filterValue;
  };

  // Notice type options
  const noticeTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "rent", label: "Rent" },
    { value: "maintenance", label: "Maintenance" },
    { value: "payment", label: "Payment" },
    { value: "lease", label: "Lease" },
    { value: "utility", label: "Utility" },
  ];

  // Audience options
  const audienceOptions = [
    { value: "all", label: "All Audiences" },
    { value: "allTenants", label: "All Tenants" },
    { value: "specificTenants", label: "Specific Tenants" },
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
              placeholder="Search notices..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
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
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Notice Type Filter - Custom Dropdown for Mobile */}
          <div className="relative">
            <label
              htmlFor="noticeType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notice Type
            </label>
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() =>
                  setIsNoticeTypeDropdownOpen(!isNoticeTypeDropdownOpen)
                }
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-4 py-2"
                title="Filter by notice type"
              >
                <span className="truncate">
                  {getNoticeTypeDisplayName(noticeTypeFilter)}
                </span>
                <Filter className="h-5 w-5 ml-2 flex-shrink-0" />
              </button>
              {isNoticeTypeDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {noticeTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          noticeTypeFilter === option.value
                            ? "text-teal-600 bg-teal-50 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setNoticeTypeFilter(option.value);
                          setIsNoticeTypeDropdownOpen(false);
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
              id="noticeType"
              className="hidden sm:block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 shadow-sm transition-all duration-200"
              value={noticeTypeFilter}
              onChange={(e) => setNoticeTypeFilter(e.target.value)}
            >
              {noticeTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Audience Filter - Custom Dropdown for Mobile */}
          <div className="relative">
            <label
              htmlFor="audience"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Audience
            </label>
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() =>
                  setIsAudienceDropdownOpen(!isAudienceDropdownOpen)
                }
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-4 py-2"
                title="Filter by audience"
              >
                <span className="truncate">
                  {getAudienceDisplayName(audienceFilter)}
                </span>
                <Filter className="h-5 w-5 ml-2 flex-shrink-0" />
              </button>
              {isAudienceDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {audienceOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          audienceFilter === option.value
                            ? "text-teal-600 bg-teal-50 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setAudienceFilter(option.value);
                          setIsAudienceDropdownOpen(false);
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
              id="audience"
              className="hidden sm:block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 shadow-sm transition-all duration-200"
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
            >
              {audienceOptions.map((option) => (
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

export default NoticeFilters;
