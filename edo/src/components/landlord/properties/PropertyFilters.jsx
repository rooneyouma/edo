import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

const PropertyFilters = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-10 pr-4 py-2 focus:border-[#0d9488] focus:ring-[#0d9488] focus:ring-2 focus:ring-opacity-20 dark:bg-gray-800 dark:text-gray-100 sm:text-sm shadow-sm transition-all duration-200"
          placeholder="Search properties by name, address, or type..."
          value={searchQuery || ""}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="relative flex-shrink-0">
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            title="Filter by type"
          >
            <Filter className="h-5 w-5" />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <select
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 border-0 focus:ring-0 rounded-lg"
                  value={typeFilter}
                  onChange={(e) => {
                    onTypeFilterChange(e.target.value);
                    setIsFilterOpen(false);
                  }}
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
          )}
        </div>
        <select
          className="hidden sm:block w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] focus:ring-2 focus:ring-opacity-20 dark:bg-gray-700 dark:text-gray-100 shadow-sm transition-all duration-200"
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
