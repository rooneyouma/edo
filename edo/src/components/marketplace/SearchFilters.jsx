import React, { useState, useCallback, memo } from "react";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Floating Ceramic Tile Container */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[#009688] group-focus-within:text-[#00796b] transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl leading-6 bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] focus:bg-white text-base font-medium transition-all duration-300"
                    placeholder="Search by location, property type, or keywords..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={toggleFilters}
                className={`inline-flex items-center justify-center px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  showFilters
                    ? "bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white"
                    : "bg-white text-[#009688] border border-[#009688]/30 hover:border-[#009688] hover:bg-[#009688]/5"
                }`}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-5 w-5 ml-2" />
                ) : (
                  <ChevronDown className="h-5 w-5 ml-2" />
                )}
              </button>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
              <div className="mt-6 animate-slide-down">
                <div className="bg-gradient-to-br from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Transaction Type
                      </label>
                      <select
                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] text-sm font-medium transition-all duration-300 hover:border-[#009688]/50"
                        value={transactionType}
                        onChange={handleTransactionTypeChange}
                      >
                        <option value="all">All Transactions</option>
                        <option value="rent">For Rent</option>
                        <option value="sale">For Sale</option>
                        <option value="lease">For Lease</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Bedrooms
                      </label>
                      <select
                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] text-sm font-medium transition-all duration-300 hover:border-[#009688]/50"
                        value={bedrooms}
                        onChange={handleBedroomsChange}
                      >
                        <option value="any">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Bathrooms
                      </label>
                      <select
                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] text-sm font-medium transition-all duration-300 hover:border-[#009688]/50"
                        value={bathrooms}
                        onChange={handleBathroomsChange}
                      >
                        <option value="any">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Property Type
                      </label>
                      <select
                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] text-sm font-medium transition-all duration-300 hover:border-[#009688]/50"
                        value={propertyType}
                        onChange={handlePropertyTypeChange}
                      >
                        <option value="all">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="loft">Loft</option>
                        <option value="bnb">BnB</option>
                        <option value="commercial">Commercial</option>
                        <option value="land">Land</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filter Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {transactionType !== "all" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white">
                        {transactionType.charAt(0).toUpperCase() +
                          transactionType.slice(1)}
                      </span>
                    )}
                    {propertyType !== "all" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white">
                        {propertyType.charAt(0).toUpperCase() +
                          propertyType.slice(1)}
                      </span>
                    )}
                    {bedrooms !== "any" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white">
                        {bedrooms}+ Bedrooms
                      </span>
                    )}
                    {bathrooms !== "any" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white">
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
