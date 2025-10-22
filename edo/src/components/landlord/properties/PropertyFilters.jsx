import React, { useState, useEffect, useRef } from "react";
import { Search, Filter } from "lucide-react";

const PropertyFilters = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get display name for current filter
  const getFilterDisplayName = (filterValue) => {
    if (filterValue === "all") return "All Types";
    return filterValue;
  };

  // Property type options
  const propertyTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "Apartment", label: "Apartment" },
    { value: "Apartment Complex", label: "Apartment Complex" },
    { value: "Condominium", label: "Condominium" },
    { value: "Townhouse", label: "Townhouse" },
    { value: "Loft", label: "Loft" },
    { value: "Villa", label: "Villa" },
    { value: "Other", label: "Other" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="relative flex-shrink-0 w-full sm:w-48" ref={dropdownRef}>
        <div className="w-full">
          <button
            type="button"
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-4 py-2"
            title="Filter by type"
          >
            <span className="truncate">{getFilterDisplayName(typeFilter)}</span>
            <Filter className="h-5 w-5 ml-2 flex-shrink-0" />
          </button>
          {isTypeDropdownOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 sm:w-48 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {propertyTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      typeFilter === option.value
                        ? "text-[#0d9488] bg-[#f0fdfa] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      onTypeFilterChange(option.value);
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
