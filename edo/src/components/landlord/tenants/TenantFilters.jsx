import React, { useState } from "react";
import { Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import StyledDropdown from "../../ui/StyledDropdown";

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
            id="property"
            label="Property"
            options={propertyOptions}
            value={propertyFilter}
            onChange={setPropertyFilter}
            placeholder="All Properties"
          />
        </div>
      )}
    </div>
  );
};

export default TenantFilters;
