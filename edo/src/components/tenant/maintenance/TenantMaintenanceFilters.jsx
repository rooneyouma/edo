import React, { useState } from "react";
import { Search, Filter, ArrowUpDown, ChevronDown, Plus } from "lucide-react";
import StyledDropdown from "../../ui/StyledDropdown";

const TenantMaintenanceFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortOrder,
  setSortOrder,
  onOpenNewRequest,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      {/* Search, Sort, and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#0d9488] focus:ring-[#0d9488] focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 sm:text-sm shadow-sm transition-all duration-200"
              placeholder="Search maintenance requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() =>
              setSortOrder(sortOrder === "latest" ? "earliest" : "latest")
            }
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "latest" ? "Latest" : "Earliest"}
          </button>
          {/* Desktop: New Request button in controls */}
          <button
            type="button"
            onClick={onOpenNewRequest}
            className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#0d9488] hover:bg-[#0d7a6f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
          >
            New Request
          </button>
        </div>
      </div>

      {/* Mobile: New Request button under search bar */}
      <div className="block sm:hidden mb-4">
        <button
          type="button"
          onClick={onOpenNewRequest}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#0d9488] hover:bg-[#0d7a6f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </button>
      </div>

      {isFilterOpen && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StyledDropdown
            id="status"
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
          />
          <StyledDropdown
            id="priority"
            label="Priority"
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
            placeholder="All Priority"
          />
        </div>
      )}
    </div>
  );
};

export default TenantMaintenanceFilters;
