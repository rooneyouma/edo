import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

const PropertyFilters = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get display name for current filter
  const getFilterDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Types";
    return filterValue;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#0d9488] focus:ring-[#0d9488] focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 sm:text-sm shadow-sm transition-all duration-200"
          placeholder="Search properties by name, address, or type..."
          value={searchQuery || ""}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="relative flex-shrink-0 w-full sm:w-auto">
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-4 py-2"
            title="Filter by type"
          >
            <span className="truncate">{getFilterDisplayName(typeFilter)}</span>
            <Filter className="h-5 w-5 ml-2 flex-shrink-0" />
          </button>
          {isFilterOpen && (
            <div className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {[
                  "all",
                  "Apartment Complex",
                  "Condominium",
                  "Townhouse",
                  "Loft",
                  "Villa",
                  "Other",
                ].map((option) => (
                  <button
                    key={option}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      typeFilter === option
                        ? "text-[#0d9488] bg-[#f0fdfa] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      onTypeFilterChange(option);
                      setIsFilterOpen(false);
                    }}
                  >
                    {option === "all" ? "All Types" : option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <select
          className="hidden sm:block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 shadow-sm transition-all duration-200"
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Apartment Complex">Apartment Complex</option>
          <option value="Condominium">Condominium</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Loft">Loft</option>
          <option value="Villa">Villa</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
};

export default PropertyFilters;
