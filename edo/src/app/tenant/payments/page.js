"use client";

import React, { useState, useEffect } from "react";
import TenantHeader from "@/partials/tenant/TenantHeader.jsx";
import TenantSidebar from "@/partials/tenant/TenantSidebar.jsx";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";
import Modal from "@/partials/Modal.jsx";
import { isAuthenticated } from "@/utils/api.js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { jsPDF } from "jspdf";

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
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for query parameter to open pay rent modal
  useEffect(() => {
    if (isClient) {
      const openPayRent = searchParams.get("openPayRent");
      if (openPayRent === "true") {
        // If only one property, auto-select it
        if (properties.length === 1) {
          setSelectedProperty(properties[0]);
        }
        setShowPaymentModal(true);
      }
    }
  }, [isClient, searchParams]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

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
      property: "Sunset Apartments",
      unit: "A101",
    },
    {
      id: 2,
      date: "2024-02-01",
      amount: 1200.0,
      status: "Paid",
      method: "Credit Card",
      reference: "#PAY-002",
      property: "Sunset Apartments",
      unit: "A101",
    },
    {
      id: 3,
      date: "2024-01-01",
      amount: 1200.0,
      status: "Paid",
      method: "M-PESA",
      reference: "#PAY-003",
      property: "Sunset Apartments",
      unit: "A101",
    },
    {
      id: 4,
      date: "2023-12-01",
      amount: 1200.0,
      status: "Paid",
      method: "Bank Transfer",
      reference: "#PAY-004",
      property: "Sunset Apartments",
      unit: "A101",
    },
    {
      id: 5,
      date: "2023-11-01",
      amount: 1200.0,
      status: "Paid",
      method: "Credit Card",
      reference: "#PAY-005",
      property: "Sunset Apartments",
      unit: "A101",
    },
    {
      id: 6,
      date: "2023-10-01",
      amount: 900.0,
      status: "Paid",
      method: "M-PESA",
      reference: "#PAY-006",
      property: "Mountain View Condos",
      unit: "B202",
    },
    {
      id: 7,
      date: "2023-09-01",
      amount: 900.0,
      status: "Paid",
      method: "Bank Transfer",
      reference: "#PAY-007",
      property: "Mountain View Condos",
      unit: "B202",
    },
    {
      id: 8,
      date: "2023-08-01",
      amount: 900.0,
      status: "Paid",
      method: "Credit Card",
      reference: "#PAY-008",
      property: "Mountain View Condos",
      unit: "B202",
    },
    {
      id: 9,
      date: "2023-07-01",
      amount: 900.0,
      status: "Paid",
      method: "M-PESA",
      reference: "#PAY-009",
      property: "Mountain View Condos",
      unit: "B202",
    },
    {
      id: 10,
      date: "2023-06-01",
      amount: 900.0,
      status: "Paid",
      method: "Bank Transfer",
      reference: "#PAY-010",
      property: "Mountain View Condos",
      unit: "B202",
    },
    {
      id: 11,
      date: "2023-05-01",
      amount: 1200.0,
      status: "Paid",
      method: "Credit Card",
      reference: "#PAY-011",
      property: "Sunset Apartments",
      unit: "A101",
    },
    {
      id: 12,
      date: "2023-04-01",
      amount: 1200.0,
      status: "Paid",
      method: "M-PESA",
      reference: "#PAY-012",
      property: "Sunset Apartments",
      unit: "A101",
    },
  ];

  // Filter and sort payments
  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch =
        payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (payment.unit &&
          payment.unit.toLowerCase().includes(searchQuery.toLowerCase())) ||
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

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setPageInputValue(pageNumber.toString());
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const generateReceiptPDF = (payment) => {
    const doc = new jsPDF();

    // Add logo or header
    doc.setFontSize(20);
    doc.text("Payment Receipt", 105, 20, { align: "center" });

    // Add receipt details
    doc.setFontSize(12);
    doc.text(`Receipt ID: ${payment.reference}`, 20, 40);
    doc.text(`Date: ${payment.date}`, 20, 50);

    // Property Information
    doc.setFontSize(14);
    doc.text("Property Information", 20, 70);
    doc.setFontSize(12);
    doc.text(`Property: ${payment.property}`, 20, 80);
    doc.text(`Unit: ${payment.unit || "N/A"}`, 20, 90);

    // Payment Information
    doc.setFontSize(14);
    doc.text("Payment Information", 20, 110);
    doc.setFontSize(12);
    doc.text(`Amount: $${payment.amount.toFixed(2)}`, 20, 120);
    doc.text(`Payment Method: ${payment.method}`, 20, 130);
    doc.text(`Status: ${payment.status}`, 20, 140);

    // Add footer
    doc.setFontSize(10);
    doc.text("Thank you for your payment!", 105, 180, { align: "center" });
    doc.text("This is an official receipt", 105, 190, { align: "center" });

    return doc;
  };

  const handleSharePDF = (payment, method) => {
    const doc = generateReceiptPDF(payment);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    if (method === "email") {
      // First save the PDF
      doc.save(`receipt_${payment.reference}.pdf`);

      // Then open email client with instructions
      const emailSubject = `Payment Receipt - ${payment.reference}`;
      const emailBody = `I've downloaded the receipt as a PDF file. Please manually attach the file "receipt_${
        payment.reference
      }.pdf" from your downloads folder to this email.\n\nPayment Details:\nProperty: ${
        payment.property
      } - ${payment.unit || "N/A"}\nAmount: $${payment.amount.toFixed(
        2
      )}\nPayment Date: ${payment.date}\nPayment Method: ${payment.method}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
    } else if (method === "whatsapp") {
      // First save the PDF
      doc.save(`receipt_${payment.reference}.pdf`);

      // Then open WhatsApp with a message
      const whatsappText = `Payment Receipt - ${payment.reference}

I've downloaded the receipt as a PDF file. Please manually attach the file "receipt_${
        payment.reference
      }.pdf" from your downloads folder to this message.

Payment Details:
Property: ${payment.property} - ${payment.unit || "N/A"}
Amount: $${payment.amount.toFixed(2)}
Payment Date: ${payment.date}
Payment Method: ${payment.method}`;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
        "_blank"
      );
    }
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
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        <TenantHeader toggleSidebar={toggleSidebar} />
        <main className="grow">
          <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-8 w-full">
            {/* Page header - Responsive, title always at top, button below on mobile */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Payments
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  View and manage your rental payments
                </p>
              </div>
              <button
                onClick={handlePayRent}
                className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto"
              >
                Pay Rent
              </button>
            </div>

            {/* Payment summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Total Paid */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total Paid
                    </p>
                    <p className="mt-1 text-base sm:text-lg lg:text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      $12,000
                    </p>
                  </div>
                  <div className="p-1.5 sm:p-2 lg:p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400"
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
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Current Balance
                    </p>
                    <p className="mt-1 text-base sm:text-lg lg:text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      $1,200
                    </p>
                  </div>
                  <div className="p-1.5 sm:p-2 lg:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400"
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
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Next Payment
                    </p>
                    <p className="mt-1 text-base sm:text-lg lg:text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      $1,200
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Due in 15 days
                    </p>
                  </div>
                  <div className="p-1.5 sm:p-2 lg:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600 dark:text-yellow-400"
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
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Payment History
                    </p>
                    <p className="mt-1 text-base sm:text-lg lg:text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      10
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Total payments
                    </p>
                  </div>
                  <div className="p-1.5 sm:p-2 lg:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400"
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
            <div className="p-4 sm:p-6">
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
                      className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] dark:bg-gray-800 dark:text-gray-100"
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
                      className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-xs sm:text-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100"
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
                      className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Payment Method
                    </label>
                    <select
                      id="method"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-xs sm:text-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100"
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

              {/* Payment history - responsive card layout for mobile, table for desktop */}
              <div className="mt-6">
                {/* Mobile Card Layout */}
                <div className="block md:hidden">
                  <div className="grid gap-4">
                    {currentPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow duration-200"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {payment.reference}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {payment.property} - {payment.unit || "N/A"}
                              </p>
                            </div>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-4 ${
                                payment.status === "Paid"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : payment.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500 dark:text-slate-400">
                                Amount:
                              </span>
                              <span className="ml-1 font-medium text-slate-900 dark:text-slate-100">
                                ${payment.amount.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 dark:text-slate-400">
                                Date:
                              </span>
                              <span className="ml-1 text-slate-900 dark:text-slate-100">
                                {new Date(payment.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 dark:text-slate-400">
                                Method:
                              </span>
                              <span className="ml-1 text-slate-900 dark:text-slate-100">
                                {payment.method}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                              >
                                Property
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                              >
                                Unit
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                              >
                                Amount
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                              >
                                Status
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                              >
                                Method
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                              >
                                Reference
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {currentPayments.map((payment) => (
                              <tr
                                key={payment.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() => setSelectedPayment(payment)}
                              >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                                  {new Date(payment.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  {payment.property}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  {payment.unit || "-"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  ${payment.amount.toFixed(2)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  <span
                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
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
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  {payment.method}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
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
              </div>

              {/* Pagination */}
              {filteredPayments.length > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-700 dark:text-gray-200">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-700 dark:text-gray-200">
                          Go to page:
                        </span>
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={pageInputValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPageInputValue(value);
                            const page = parseInt(value);
                            if (page >= 1 && page <= totalPages) {
                              handlePageChange(page);
                            }
                          }}
                          onBlur={() => {
                            const page = parseInt(pageInputValue);
                            if (page < 1) {
                              setPageInputValue("1");
                              handlePageChange(1);
                            } else if (page > totalPages) {
                              setPageInputValue(totalPages.toString());
                              handlePageChange(totalPages);
                            }
                          }}
                          className="w-12 h-6 text-xs text-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center p-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center p-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40 transition-opacity">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
              <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-3 pb-3 pt-4 sm:px-4 sm:pb-4 sm:pt-5 text-left shadow-xl transition-all w-full max-w-lg">
                <div className="absolute right-0 top-0 pr-3 pt-3 sm:pr-4 sm:pt-4">
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
                      className="h-5 w-5 sm:h-6 sm:w-6"
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
                  <div className="mt-2 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg sm:text-xl font-semibold leading-6 text-slate-900 dark:text-slate-100">
                      Pay Rent
                    </h3>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                  {/* Property Selection */}
                  {properties.length > 1 && (
                    <div>
                      <label
                        htmlFor="property"
                        className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
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
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-xs sm:text-sm py-2 px-3"
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
                      <h4 className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Payment Amount
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 sm:p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                            Monthly Rent
                          </span>
                          <span className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                            ${selectedProperty.rent.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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
                      <h4 className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 sm:mb-4">
                        Select Payment Method
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`flex items-center p-3 sm:p-4 rounded-lg border ${
                              selectedPaymentMethod === method.id
                                ? "border-[#0d9488] bg-[#0d9488]/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-[#0d9488]"
                            }`}
                          >
                            <div
                              className={`p-1.5 sm:p-2 rounded-full ${
                                selectedPaymentMethod === method.id
                                  ? "bg-[#0d9488]/10 text-[#0d9488]"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {method.icon}
                            </div>
                            <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                              {method.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Form */}
                  {selectedPaymentMethod && selectedProperty && (
                    <div className="mt-4 sm:mt-6">
                      {selectedPaymentMethod === "card" && (
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label
                              htmlFor="cardNumber"
                              className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                            >
                              Card Number
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-xs sm:text-sm py-2 px-3"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label
                                htmlFor="expiry"
                                className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                              >
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                id="expiry"
                                placeholder="MM/YY"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-xs sm:text-sm py-2 px-3"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="cvv"
                                className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                              >
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                placeholder="123"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-xs sm:text-sm py-2 px-3"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPaymentMethod === "bank" && (
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label
                              htmlFor="accountNumber"
                              className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                            >
                              Account Number
                            </label>
                            <input
                              type="text"
                              id="accountNumber"
                              placeholder="Enter your account number"
                              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-xs sm:text-sm py-2 px-3"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="routingNumber"
                              className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                            >
                              Routing Number
                            </label>
                            <input
                              type="text"
                              id="routingNumber"
                              placeholder="Enter your routing number"
                              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-xs sm:text-sm py-2 px-3"
                            />
                          </div>
                        </div>
                      )}

                      {selectedPaymentMethod === "mpesa" && (
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label
                              htmlFor="phoneNumber"
                              className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                            >
                              M-PESA Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phoneNumber"
                              placeholder="Enter your M-PESA phone number"
                              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-xs sm:text-sm py-2 px-3"
                            />
                          </div>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            You will receive a prompt on your phone to confirm
                            the payment.
                          </p>
                        </div>
                      )}

                      {selectedPaymentMethod === "paypal" && (
                        <div className="text-center py-3 sm:py-4">
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
                            You will be redirected to PayPal to complete your
                            payment.
                          </p>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                          >
                            Continue with PayPal
                          </button>
                        </div>
                      )}

                      <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-[#0d9488] px-3 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#0f766e] sm:ml-3 sm:w-auto"
                        >
                          Pay ${selectedProperty.rent.toLocaleString()}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-100 dark:ring-slate-600 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto"
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
          <div className="space-y-4 sm:space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg sm:text-xl font-medium text-slate-900 dark:text-slate-100">
                  Payment Details
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Reference: {selectedPayment.reference}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Date
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {new Date(selectedPayment.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Amount
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  ${selectedPayment.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Status
                </h4>
                <span
                  className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium mt-1 ${
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
                <h4 className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Payment Method
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {selectedPayment.method}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
              {selectedPayment.status === "Paid" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const doc = generateReceiptPDF(selectedPayment);
                      doc.save(`receipt_${selectedPayment.reference}.pdf`);
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSharePDF(selectedPayment, "email")}
                    className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Share via Email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSharePDF(selectedPayment, "whatsapp")}
                    className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="#25D366"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.742.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                    Share via WhatsApp
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
