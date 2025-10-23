import React, { useState, useCallback, memo } from "react";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

const SearchFilters = memo(
  ({
    searchQuery,
    setSearchQuery,
    propertyType,
    setPropertyType,
    transactionType,
    setTransactionType,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
  }) => {
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchChange = useCallback(
      (e) => {
        setSearchQuery(e.target.value);
      },
      [setSearchQuery]
    );

    const handlePropertyTypeChange = useCallback(
      (e) => {
        setPropertyType(e.target.value);
      },
      [setPropertyType]
    );

    const handleTransactionTypeChange = useCallback(
      (e) => {
        setTransactionType(e.target.value);
      },
      [setTransactionType]
    );

    const handleBedroomsChange = useCallback(
      (e) => {
        setBedrooms(e.target.value);
      },
      [setBedrooms]
    );

    const handleBathroomsChange = useCallback(
      (e) => {
        setBathrooms(e.target.value);
      },
      [setBathrooms]
    );

    const toggleFilters = useCallback(() => {
      setShowFilters((prev) => !prev);
    }, []);

    return (
      <div className="sticky top-0 z-40 py-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          {/* Floating Ceramic Tile Container */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 p-4 sm:p-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none sm:pl-4">
                    <Search className="h-4 w-4 text-[#009688] group-focus-within:text-[#00796b] transition-colors duration-300 sm:h-5 sm:w-5" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl sm:rounded-2xl leading-6 bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] focus:bg-white text-sm font-medium transition-all duration-300 sm:pl-12 sm:pr-4 sm:py-4 sm:text-base md:py-3 md:pl-10 md:pr-4 md:text-sm"
                    placeholder="Search by location, property type, or keywords..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={toggleFilters}
                className={`inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl sm:px-6 sm:py-4 sm:text-base md:px-4 md:py-3 md:text-sm ${
                  showFilters
                    ? "bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white"
                    : "bg-white text-[#009688] border border-[#009688]/30 hover:border-[#009688] hover:bg-[#009688]/5"
                }`}
                aria-label="Filter properties"
              >
                <Filter className="h-4 w-4 md:h-4 md:w-4" />
                {showFilters ? (
                  <ChevronUp className="h-4 w-4 ml-1 md:ml-0 md:h-4 md:w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1 md:ml-0 md:h-4 md:w-4" />
                )}
              </button>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
              <div className="mt-6 animate-slide-down">
                <div className="bg-gradient-to-br from-gray-50/50 to-white/50 rounded-2xl p-4 sm:p-6 border border-gray-200/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Transaction Type
                      </label>
                      <CustomSelect
                        options={[
                          { value: "all", label: "All Transactions" },
                          { value: "rent", label: "For Rent" },
                          { value: "sale", label: "For Sale" },
                          { value: "lease", label: "For Lease" },
                        ]}
                        value={transactionType}
                        onChange={handleTransactionTypeChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Bedrooms
                      </label>
                      <CustomSelect
                        options={[
                          { value: "any", label: "Any" },
                          { value: "1", label: "1+" },
                          { value: "2", label: "2+" },
                          { value: "3", label: "3+" },
                          { value: "4", label: "4+" },
                          { value: "5", label: "5+" },
                        ]}
                        value={bedrooms}
                        onChange={handleBedroomsChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Bathrooms
                      </label>
                      <CustomSelect
                        options={[
                          { value: "any", label: "Any" },
                          { value: "1", label: "1+" },
                          { value: "2", label: "2+" },
                          { value: "3", label: "3+" },
                          { value: "4", label: "4+" },
                        ]}
                        value={bathrooms}
                        onChange={handleBathroomsChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Property Type
                      </label>
                      <CustomSelect
                        options={[
                          { value: "all", label: "All Types" },
                          { value: "apartment", label: "Apartment" },
                          { value: "house", label: "House" },
                          { value: "condo", label: "Condo" },
                          { value: "townhouse", label: "Townhouse" },
                        ]}
                        value={propertyType}
                        onChange={handlePropertyTypeChange}
                      />
                    </div>
                  </div>

                  {/* Active Filter Tags - Optimized for Mobile */}
                  <div className="mt-4 flex flex-wrap gap-1 sm:gap-2">
                    {transactionType !== "all" && (
                      <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white">
                        {transactionType.charAt(0).toUpperCase() +
                          transactionType.slice(1)}
                      </span>
                    )}
                    {propertyType !== "all" && (
                      <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white">
                        {propertyType.charAt(0).toUpperCase() +
                          propertyType.slice(1)}
                      </span>
                    )}
                    {bedrooms !== "any" && (
                      <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white">
                        {bedrooms}+ Bedrooms
                      </span>
                    )}
                    {bathrooms !== "any" && (
                      <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white">
                        {bathrooms}+ Bathrooms
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SearchFilters.displayName = "SearchFilters";

export default SearchFilters;
