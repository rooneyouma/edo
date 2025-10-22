"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TenantHeader from "@/partials/tenant/TenantHeader.jsx";
import TenantSidebar from "@/partials/tenant/TenantSidebar.jsx";
import { isAuthenticated, tenantAPI, getStoredUser } from "@/utils/api.js";

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
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
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

  // Get user's preferred currency
  const getUserCurrency = () => {
    try {
      const user = getStoredUser();
      return user?.preferences?.currency || "KES";
    } catch (e) {
      // Fallback to KES if there's any error accessing user data
      return "KES";
    }
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
    if (!amount) return "KES 0";

    // Ensure amount is a number
    const numericAmount =
      typeof amount === "number" ? amount : parseFloat(amount);
    if (isNaN(numericAmount)) return "KES 0";

    const currency = getUserCurrency();

    // Try to format with Intl.NumberFormat first
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(numericAmount);
    } catch (e) {
      // Fallback to manual formatting if Intl fails
      // Map currency codes to symbols for common currencies
      const currencySymbols = {
        USD: "$",
        KES: "KES",
        EUR: "€",
        GBP: "£",
        CAD: "C$",
      };

      const symbol = currencySymbols[currency] || currency;
      // Special handling for KES to show "KES" symbol
      if (currency === "KES") {
        return `KES ${numericAmount.toLocaleString()}`;
      }
      return `${symbol}${numericAmount.toLocaleString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TenantHeader toggleSidebar={toggleSidebar} />
          {/* Main content */}
          <main className="flex-1 transition-all duration-200">
            <div className="w-full pl-2 pr-6 sm:pl-4 sm:pr-8 md:pl-6 md:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-8">
              {/* Page header - Responsive, title always at top */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                  My Rentals
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  View and manage your rental properties
                </p>
              </div>

              {/* Loading state */}
              {loading && (
                <div className="text-center py-12">
                  <div className="text-slate-500">
                    Loading your rental properties...
                  </div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">{error}</div>
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
                  <div className="text-slate-500 text-lg mb-2">
                    No Rental Properties
                  </div>
                  <p className="text-slate-400 mb-4">
                    You don't have any rental properties yet. Contact your
                    landlord to get started.
                  </p>
                </div>
              )}

              {/* Properties grid */}
              {!loading && !error && rentals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentals.map((rental) => (
                    <div
                      key={rental.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col group"
                    >
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-[#0d9488] mb-1 line-clamp-1">
                          {rental.property_name}
                        </h3>
                        <p className="text-sm text-gray-700 mb-1 flex items-center">
                          <span className="truncate">{rental.unit_number}</span>
                        </p>
                        <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          {rental.property_type}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>Bed: {rental.bedrooms}</span>
                          <span>Bath: {rental.bathrooms}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>
                            Rent: {formatCurrency(rental.monthly_rent)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          Lease ends: {formatDate(rental.lease_end_date)}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2 p-3 border-t border-gray-100 bg-white/60">
                        <button
                          onClick={() => setSelectedRental(rental)}
                          className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
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
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Rental Details Modal */}
      {selectedRental && (
        <div className="fixed inset-0 bg-gray-500/50 z-40 transition-opacity">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-3 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 w-full max-w-md">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none"
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
                    <h3 className="text-lg font-semibold leading-6 text-slate-900">
                      {selectedRental.property_name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedRental.unit_number}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Lease Information */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-3">
                      Lease Information
                    </h4>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm text-slate-500">Monthly Rent</dt>
                        <dd className="mt-1 text-sm text-slate-900">
                          {formatCurrency(selectedRental.monthly_rent)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500">
                          Security Deposit
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900">
                          {formatCurrency(selectedRental.security_deposit)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500">
                          Agreement Type
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900">
                          {selectedRental.lease_type
                            ?.toLowerCase()
                            .includes("lease")
                            ? "Lease Agreement"
                            : selectedRental.lease_type
                                ?.toLowerCase()
                                .includes("rent")
                            ? "Rental Agreement"
                            : selectedRental.lease_type || "N/A"}
                        </dd>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-slate-500">Start Date</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {formatDate(selectedRental.lease_start_date)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-slate-500">End Date</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {formatDate(selectedRental.lease_end_date)}
                          </dd>
                        </div>
                      </div>
                    </dl>
                  </div>

                  {/* Property Details and Address */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-3">
                      Property Details
                    </h4>
                    <dl className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-slate-500">Type</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {selectedRental.property_type}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-slate-500">Floor</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {selectedRental.floor || "N/A"}
                          </dd>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-slate-500">Bedrooms</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {selectedRental.bedrooms}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-slate-500">Bathrooms</dt>
                          <dd className="mt-1 text-sm text-slate-900">
                            {selectedRental.bathrooms}
                          </dd>
                        </div>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-500">Address</dt>
                        <dd className="mt-1 text-sm text-slate-900">
                          {selectedRental.address}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Contact Information */}
                  <div className="sm:col-span-2">
                    <h4 className="text-sm font-medium text-slate-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Landlord Contact */}
                      <div>
                        <h5 className="text-xs font-medium text-slate-700 mb-2">
                          Landlord
                        </h5>
                        <dl className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <dt className="text-sm text-slate-500">Name</dt>
                              <dd className="mt-1 text-sm text-slate-900">
                                {selectedRental.landlord_name}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-slate-500">Email</dt>
                              <dd className="mt-1 text-sm text-slate-900">
                                {selectedRental.landlord_email}
                              </dd>
                            </div>
                          </div>
                          <div>
                            <dt className="text-sm text-slate-500">Phone</dt>
                            <dd className="mt-1 text-sm text-slate-900">
                              {selectedRental.landlord_phone || "N/A"}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Emergency Contact */}
                      <div>
                        <h5 className="text-xs font-medium text-slate-700 mb-2">
                          Emergency Contact
                        </h5>
                        <dl className="space-y-3">
                          <div>
                            <dt className="text-sm text-slate-500">Name</dt>
                            <dd className="mt-1 text-sm text-slate-900">
                              {selectedRental.emergency_contact_name || "N/A"}
                            </dd>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <dt className="text-sm text-slate-500">Phone</dt>
                              <dd className="mt-1 text-sm text-slate-900">
                                {selectedRental.emergency_contact_phone ||
                                  "N/A"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-slate-500">
                                Relationship
                              </dt>
                              <dd className="mt-1 text-sm text-slate-900">
                                {selectedRental.emergency_contact_relationship ||
                                  "N/A"}
                              </dd>
                            </div>
                          </div>
                        </dl>
                      </div>
                    </div>
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
