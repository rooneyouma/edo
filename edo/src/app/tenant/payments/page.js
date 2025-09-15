"use client";

import React, { useState } from "react";
import TenantHeader from "@/partials/tenant/TenantHeader.jsx";
import TenantSidebar from "@/partials/tenant/TenantSidebar.jsx";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";
import Modal from "@/partials/Modal.jsx";
import { isAuthenticated } from "@/utils/api.js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Payments = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const router = useRouter();

  if (!isAuthenticated()) {
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

  // Mock data for properties
  const properties = [
    {
      id: 1,
      address: "123 Main Street",
      unit: "Apartment 4B",
      rent: 1200,
      dueDate: "2024-04-01",
    },
    {
      id: 2,
      address: "456 Oak Avenue",
      unit: "Unit 12",
      rent: 900,
      dueDate: "2024-04-05",
    },
  ];

  // Mock data for payments
  const payments = [
    {
      id: 1,
      date: "2024-03-01",
      amount: 1200.0,
      status: "Paid",
      method: "Bank Transfer",
      reference: "#PAY-001",
    },
    {
      id: 2,
      date: "2024-02-01",
      amount: 1200.0,
      status: "Paid",
      method: "Credit Card",
      reference: "#PAY-002",
    },
    {
      id: 3,
      date: "2024-01-01",
      amount: 1200.0,
      status: "Paid",
      method: "M-PESA",
      reference: "#PAY-003",
    },
  ];

  // Filter and sort payments
  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch =
        payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.amount.toString().includes(searchQuery) ||
        payment.amount.toFixed(2).includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        payment.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesMethod =
        methodFilter === "all" ||
        payment.method.toLowerCase() === methodFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesMethod;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePayRent = () => {
    // If only one property, auto-select it
    if (properties.length === 1) {
      setSelectedProperty(properties[0]);
    }
    setShowPaymentModal(true);
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      id: "mpesa",
      name: "M-PESA",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

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
          {/* Page header - Responsive, title always at top, button below on mobile */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Payments
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                View and manage your rental payments
              </p>
            </div>
            <button
              onClick={handlePayRent}
              className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto mt-2 sm:mt-0"
            >
              Pay Rent
            </button>
          </div>

          {/* Payment summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Paid */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Paid
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    $12,000
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Current Balance */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Current Balance
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    $1,200
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Next Payment */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Next Payment
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    $1,200
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Due in 15 days
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <svg
                    className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Payment History
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    10
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Total payments
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Payment history table */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search payments..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] dark:bg-gray-800 dark:text-gray-100"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
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
                      setSortOrder(
                        sortOrder === "latest" ? "earliest" : "latest"
                      )
                    }
                    className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                  >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    {sortOrder === "latest" ? "Latest" : "Earliest"}
                  </button>
                </div>
              </div>

              {isFilterOpen && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="method"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Payment Method
                    </label>
                    <select
                      id="method"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100"
                      value={methodFilter}
                      onChange={(e) => setMethodFilter(e.target.value)}
                    >
                      <option value="all">All Methods</option>
                      <option value="bank transfer">Bank Transfer</option>
                      <option value="credit card">Credit Card</option>
                      <option value="m-pesa">M-PESA</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-6 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">
                        Date
                      </th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">
                        Amount
                      </th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">
                        Status
                      </th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">
                        Method
                      </th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">
                        Reference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <td className="py-4 text-sm text-slate-900 dark:text-slate-100">
                          {new Date(payment.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 text-sm text-slate-900 dark:text-slate-100">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.status === "Paid"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : payment.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-slate-900 dark:text-slate-100">
                          {payment.method}
                        </td>
                        <td className="py-4 text-sm text-slate-900 dark:text-slate-100">
                          {payment.reference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40 transition-opacity">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-lg">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-500 focus:outline-none"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPaymentMethod(null);
                      setSelectedProperty(null);
                    }}
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
                      Pay Rent
                    </h3>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Property Selection */}
                  {properties.length > 1 && (
                    <div>
                      <label
                        htmlFor="property"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Select Property
                      </label>
                      <select
                        id="property"
                        name="property"
                        value={selectedProperty?.id || ""}
                        onChange={(e) => {
                          const property = properties.find(
                            (p) => p.id === parseInt(e.target.value)
                          );
                          setSelectedProperty(property);
                        }}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 sm:text-sm"
                      >
                        <option value="">Select a property</option>
                        {properties.map((property) => (
                          <option key={property.id} value={property.id}>
                            {property.address} - {property.unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Payment Amount */}
                  {selectedProperty && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Payment Amount
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300">
                            Monthly Rent
                          </span>
                          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            ${selectedProperty.rent.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Due by{" "}
                          {new Date(
                            selectedProperty.dueDate
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Methods */}
                  {selectedProperty && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                        Select Payment Method
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`flex items-center p-4 rounded-lg border ${
                              selectedPaymentMethod === method.id
                                ? "border-[#0d9488] bg-[#0d9488]/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-[#0d9488]"
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full ${
                                selectedPaymentMethod === method.id
                                  ? "bg-[#0d9488]/10 text-[#0d9488]"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {method.icon}
                            </div>
                            <span className="ml-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                              {method.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Form */}
                  {selectedPaymentMethod && selectedProperty && (
                    <div className="mt-6">
                      {selectedPaymentMethod === "card" && (
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="cardNumber"
                              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                              Card Number
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 sm:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="expiry"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                              >
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                id="expiry"
                                placeholder="MM/YY"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="cvv"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                              >
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                placeholder="123"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPaymentMethod === "bank" && (
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="accountNumber"
                              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                              Account Number
                            </label>
                            <input
                              type="text"
                              id="accountNumber"
                              placeholder="Enter your account number"
                              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="routingNumber"
                              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                              Routing Number
                            </label>
                            <input
                              type="text"
                              id="routingNumber"
                              placeholder="Enter your routing number"
                              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 sm:text-sm"
                            />
                          </div>
                        </div>
                      )}

                      {selectedPaymentMethod === "mpesa" && (
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="phoneNumber"
                              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                              M-PESA Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phoneNumber"
                              placeholder="Enter your M-PESA phone number"
                              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 sm:text-sm"
                            />
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            You will receive a prompt on your phone to confirm
                            the payment.
                          </p>
                        </div>
                      )}

                      {selectedPaymentMethod === "paypal" && (
                        <div className="text-center py-4">
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            You will be redirected to PayPal to complete your
                            payment.
                          </p>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                          >
                            Continue with PayPal
                          </button>
                        </div>
                      )}

                      <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-[#0d9488] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f766e] sm:ml-3 sm:w-auto"
                        >
                          Pay ${selectedProperty.rent.toLocaleString()}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-100 dark:ring-slate-600 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto"
                          onClick={() => {
                            setShowPaymentModal(false);
                            setSelectedPaymentMethod(null);
                            setSelectedProperty(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Payment Details
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Reference: {selectedPayment.reference}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Date
                </h4>
                <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {new Date(selectedPayment.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Amount
                </h4>
                <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  ${selectedPayment.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Status
                </h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedPayment.status === "Paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : selectedPayment.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {selectedPayment.status}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Payment Method
                </h4>
                <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {selectedPayment.method}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                onClick={() => setSelectedPayment(null)}
              >
                Close
              </button>
              {selectedPayment.status === "Paid" && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                  onClick={() => alert("Download receipt (not implemented)")}
                >
                  Download Receipt
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
