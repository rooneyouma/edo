import React, { useState } from "react";
import { Search, Filter, ChevronDown, ArrowUpDown } from "lucide-react";
import CustomSelect from "../../ui/CustomSelect";

const VacateRequestFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  propertyFilter,
  setPropertyFilter,
  sortOrder,
  setSortOrder,
  propertyOptions,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
              placeholder="Search vacate requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
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
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "latest" ? "Latest" : "Earliest"}
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <CustomSelect
              id="status"
              label="Status"
              options={[
                { value: "all", label: "All Status" },
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Declined", label: "Declined" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
          <div>
            <label
              htmlFor="property"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property
            </label>
            <CustomSelect
              id="property"
              label="Property"
              options={[
                { value: "all", label: "All Properties" },
                ...propertyOptions.map((property) => ({
                  value: property,
                  label: property,
                })),
              ]}
              value={propertyFilter}
              onChange={setPropertyFilter}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VacateRequestFilters;
