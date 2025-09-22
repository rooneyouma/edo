"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TenantHeader from "@/partials/tenant/TenantHeader.jsx";
import TenantSidebar from "@/partials/tenant/TenantSidebar.jsx";
import { isAuthenticated, tenantAPI } from "@/utils/api.js";

const MyRentals = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Check authentication status
  const isAuth = isAuthenticated();

  // React Query for fetching rentals - always call this hook
  const {
    data: rentalsData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["tenant-rentals"],
    queryFn: async () => {
      const data = await tenantAPI.getRentals();
      return data.rentals || [];
    },
    enabled: isClient && isAuth, // Only fetch when client-side and authenticated
  });

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update local state when query data changes
  useEffect(() => {
    if (rentalsData) {
      setRentals(rentalsData);
    }
  }, [rentalsData]);

  // Handle error state from React Query
  useEffect(() => {
    if (queryError) {
      setError("Failed to load rental properties.");
      console.error("Error fetching rentals:", queryError);
    }
  }, [queryError]);

  // Early returns after all hooks are called
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="mb-6">You must be signed in to access this page.</p>
        <Link
          href="/signin"
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Proceed
        </Link>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <TenantHeader toggleSidebar={toggleSidebar} />
      <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <main
        className={`lg:ml-64 pt-8 sm:pt-12 transition-all duration-200 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="w-full pl-2 pr-6 sm:pl-4 sm:pr-8 md:pl-6 md:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-8">
          {/* Page header - Responsive, title always at top */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              My Rentals
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View and manage your rental properties
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <div className="text-slate-500 dark:text-slate-400">
                Loading your rental properties...
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No rentals state */}
          {!loading && !error && rentals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-500 dark:text-slate-400 text-lg mb-2">
                No Rental Properties
              </div>
              <p className="text-slate-400 dark:text-slate-500 mb-4">
                You don't have any rental properties yet. Contact your landlord
                to get started.
              </p>
            </div>
          )}

          {/* Properties grid */}
          {!loading && !error && rentals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentals.map((rental) => (
                <div
                  key={rental.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {rental.property_name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {rental.unit_number}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {rental.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Type
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {rental.property_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Unit
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {rental.unit_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Bedrooms
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {rental.bedrooms}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Bathrooms
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {rental.bathrooms}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Lease Ends
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                            {formatDate(rental.lease_end_date)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedRental(rental)}
                            className="inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              router.push(
                                `/tenant/messages?managerId=${rental.property_id}`
                              );
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e]"
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Rental Details Modal */}
      {selectedRental && (
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40 transition-opacity">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-500 focus:outline-none"
                    onClick={() => setSelectedRental(null)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100">
                      {selectedRental.property_name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {selectedRental.unit_number}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Lease Information */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                      Lease Information
                    </h4>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Monthly Rent
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {formatCurrency(selectedRental.monthly_rent)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Security Deposit
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {formatCurrency(selectedRental.security_deposit)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Lease Type
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.lease_type}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Start Date
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {formatDate(selectedRental.lease_start_date)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          End Date
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {formatDate(selectedRental.lease_end_date)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Property Details */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                      Property Details
                    </h4>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Type
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.property_type}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Bedrooms/Bathrooms
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.bedrooms} bed /{" "}
                          {selectedRental.bathrooms} bath
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Size
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.size
                            ? `${selectedRental.size} sq ft`
                            : "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Floor
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.floor || "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                      Address
                    </h4>
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      {selectedRental.address}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                      Landlord Contact
                    </h4>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Name
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.landlord_name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Email
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.landlord_email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Phone
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.landlord_phone || "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                      Emergency Contact
                    </h4>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Name
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.emergency_contact_name || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Phone
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.emergency_contact_phone || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                          Relationship
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                          {selectedRental.emergency_contact_relationship ||
                            "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#0d9488] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f766e] sm:ml-3 sm:w-auto"
                    onClick={() => setSelectedRental(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRentals;
