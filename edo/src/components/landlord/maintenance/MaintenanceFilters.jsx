import React, { useState } from "react";
import { Search, Filter, ChevronDown, ArrowUpDown } from "lucide-react";
import StyledDropdown from "../../ui/StyledDropdown";

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
  setDateFilter,
  assignmentFilter, // New prop
  setAssignmentFilter, // New prop
  sortOrder,
  setSortOrder,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Options for dropdowns
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const propertyOptions = [
    { value: "all", label: "All Properties" },
    { value: "Sunset Apartments", label: "Sunset Apartments" },
    { value: "Mountain View Condos", label: "Mountain View Condos" },
    { value: "Riverside Townhomes", label: "Riverside Townhomes" },
    { value: "Downtown Lofts", label: "Downtown Lofts" },
    { value: "Garden Villas", label: "Garden Villas" },
  ];

  const dateOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
  ];

  // New assignment options
  const assignmentOptions = [
    { value: "all", label: "All Assignments" },
    { value: "assigned", label: "Assigned" },
    { value: "unassigned", label: "Unassigned" },
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
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
        <div className="flex items-center space-x-2">
          <button
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

      {isFilterOpen && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
          <StyledDropdown
            id="property"
            label="Property"
            options={propertyOptions}
            value={propertyFilter}
            onChange={setPropertyFilter}
            placeholder="All Properties"
          />
          <StyledDropdown
            id="date"
            label="Date"
            options={dateOptions}
            value={dateFilter}
            onChange={setDateFilter}
            placeholder="All Dates"
          />
          <StyledDropdown
            id="assignment"
            label="Assignment"
            options={assignmentOptions}
            value={assignmentFilter}
            onChange={setAssignmentFilter}
            placeholder="All Assignments"
          />
        </div>
      )}
    </div>
  );
};

export default MaintenanceFilters;
