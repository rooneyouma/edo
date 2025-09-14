import React, { useState } from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';

const TenantFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  propertyFilter,
  setPropertyFilter,
  sortOrder,
  setSortOrder
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tenants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
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
            onClick={() => setSortOrder(sortOrder === 'latest' ? 'earliest' : 'latest')}
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === 'latest' ? 'Latest' : 'Earliest'}
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label htmlFor="property" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property
            </label>
            <select
              id="property"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-gray-100"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              <option value="Sunset Apartments">Sunset Apartments</option>
              <option value="Mountain View Condos">Mountain View Condos</option>
              <option value="Riverside Townhomes">Riverside Townhomes</option>
              <option value="Downtown Lofts">Downtown Lofts</option>
              <option value="Garden Villas">Garden Villas</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantFilters; 