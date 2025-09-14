import React from 'react';
import { MapPin, Home, DollarSign, Star, Calendar, Users, Bed, Bath, Square } from 'lucide-react';

const HostPropertyDetailModal = ({ property, onClose }) => {
  if (!property) return null;

  return (
    <>
      {/* Property Details */}
      <div className="space-y-6 mt-8">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {property.name}
            </h3>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {property.rating}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg min-w-0">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-sm">Price</span>
            </div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100 break-words text-base sm:text-lg">
              ${property.price}/night
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">Occupancy</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {property.occupancy}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Home className="h-4 w-4 mr-1" />
              <span className="text-sm">Type</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {property.type}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">Listed</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {new Date(property.listedDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Bed className="h-4 w-4 mr-1" />
            <span>2 Bedrooms</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Bath className="h-4 w-4 mr-1" />
            <span>2 Bathrooms</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Square className="h-4 w-4 mr-1" />
            <span>1,200 sqft</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 bg-teal-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer text-xs sm:text-sm font-medium">
            Edit Listing
          </button>
          <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer text-xs sm:text-sm font-medium">
            View Bookings
          </button>
        </div>
      </div>
    </>
  );
};

export default HostPropertyDetailModal; 