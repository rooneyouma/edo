import React from 'react';

const PropertyDetailModal = ({ property, onClose }) => {
  if (!property) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/30 dark:bg-gray-900/50 transition-opacity">
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                onClick={onClose}
                className="rounded-md bg-white dark:bg-slate-800 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{property.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{property.address}</p>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                {/* Property Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Property Details</h4>
                  <dl className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{property.type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Units</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{property.units}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Year Built</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{property.yearBuilt}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Renovation</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{property.lastRenovation}</dd>
                    </div>
                  </dl>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Amenities</h4>
                  <ul className="mt-2 grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <li key={index} className="text-sm text-gray-900 dark:text-gray-100">
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Description</h4>
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">{property.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal; 