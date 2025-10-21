import React, { useState } from "react";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";

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
  sortOrder,
  setSortOrder,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
            {isFilterOpen ? (
              <X className="h-4 w-4 ml-2" />
            ) : (
              <span className="ml-2">▼</span>
            )}
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
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              className="block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 shadow-sm transition-all duration-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              className="block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 shadow-sm transition-all duration-200"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="property"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property
            </label>
            <select
              id="property"
              className="block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 shadow-sm transition-all duration-200"
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
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <select
              id="date"
              className="block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] focus:ring-2 focus:ring-opacity-20 bg-white text-gray-900 shadow-sm transition-all duration-200"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceFilters;
