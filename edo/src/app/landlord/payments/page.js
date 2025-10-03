"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { jsPDF } from "jspdf";
import { Search, Filter, ChevronDown } from "lucide-react";
import { isAuthenticated } from "../../../utils/api";

import Sidebar from "../../../partials/dashboard/LandlordSidebar";
import Header from "../../../partials/dashboard/LandlordHeader";
import RecordPaymentForm from "../../../components/landlord/forms/RecordPaymentForm";
import PaymentFilters from "../../../components/landlord/payments/PaymentFilters";
import Modal from "../../../partials/Modal";

const Payments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] =
    useState(false);
  const [isClient, setIsClient] = useState(false); // Add client-side check
  const itemsPerPage = 10;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Use Next.js hook instead of window.location.search
  const [sortOrder, setSortOrder] = useState("latest");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock data for payments
  const [payments, setPayments] = useState([
    {
      id: 1,
      tenant: "John Doe",
      property: "Sunset Apartments",
      unit: "A101",
      amount: 1200,
      dueDate: "2024-03-01",
      status: "Paid",
      paymentDate: "2024-02-28",
      paymentMethod: "Credit Card",
    },
    {
      id: 2,
      tenant: "Jane Smith",
      property: "Mountain View Condos",
      unit: "B202",
      amount: 1500,
      dueDate: "2024-03-15",
      status: "Pending",
      paymentDate: null,
      paymentMethod: null,
    },
    {
      id: 3,
      tenant: "Bob Johnson",
      property: "Riverside Townhomes",
      unit: "C303",
      amount: 1800,
      dueDate: "2024-02-15",
      status: "Overdue",
      paymentDate: null,
      paymentMethod: null,
    },
    {
      id: 4,
      tenant: "Alice Brown",
      property: "Downtown Lofts",
      unit: "D404",
      amount: 2000,
      dueDate: "2024-03-10",
      status: "Paid",
      paymentDate: "2024-03-05",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 5,
      tenant: "Charlie Wilson",
      property: "Garden Villas",
      unit: "E505",
      amount: 1600,
      dueDate: "2024-03-20",
      status: "Paid",
      paymentDate: "2024-03-15",
      paymentMethod: "Credit Card",
    },
    {
      id: 6,
      tenant: "Emma Davis",
      property: "Sunset Apartments",
      unit: "A102",
      amount: 1400,
      dueDate: "2024-02-20",
      status: "Paid",
      paymentDate: "2024-02-15",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 7,
      tenant: "Michael Wilson",
      property: "Mountain View Condos",
      unit: "B203",
      amount: 1700,
      dueDate: "2024-03-25",
      status: "Pending",
      paymentDate: null,
      paymentMethod: null,
    },
    {
      id: 8,
      tenant: "Sarah Thompson",
      property: "Riverside Townhomes",
      unit: "C304",
      amount: 1900,
      dueDate: "2024-02-10",
      status: "Overdue",
      paymentDate: null,
      paymentMethod: null,
    },
  ]);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for search parameter in URL on component mount (client-side safe)
  useEffect(() => {
    if (isClient) {
      const tenantName = searchParams.get("tenant");
      if (tenantName) {
        setSearchQuery(tenantName);
      }
    }
  }, [isClient, searchParams]);

  // Filter and sort payments
  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch =
        payment.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.paymentMethod
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        payment.amount.toString().includes(searchQuery) ||
        payment.amount.toFixed(2).includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;
      const matchesProperty =
        propertyFilter === "all" || payment.property === propertyFilter;
      const matchesPaymentMethod =
        paymentMethodFilter === "all" ||
        payment.paymentMethod === paymentMethodFilter;
      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" &&
          new Date(payment.dueDate).toDateString() ===
            new Date().toDateString()) ||
        (dateFilter === "week" &&
          new Date(payment.dueDate) >=
            new Date(new Date().setDate(new Date().getDate() - 7))) ||
        (dateFilter === "month" &&
          new Date(payment.dueDate) >=
            new Date(new Date().setMonth(new Date().getMonth() - 1)));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProperty &&
        matchesPaymentMethod &&
        matchesDate
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.status === "Paid" ? a.paymentDate : a.dueDate);
      const dateB = new Date(b.status === "Paid" ? b.paymentDate : b.dueDate);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPageInputValue(pageNumber.toString());
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    router.push("/landlord/payments");
  };

  const generateReceiptPDF = (payment) => {
    const doc = new jsPDF();

    // Add logo or header
    doc.setFontSize(20);
    doc.text("Payment Receipt", 105, 20, { align: "center" });

    // Add receipt details
    doc.setFontSize(12);
    doc.text(`Receipt ID: ${payment.id}`, 20, 40);
    doc.text(`Date: ${payment.paymentDate}`, 20, 50);

    // Tenant Information
    doc.setFontSize(14);
    doc.text("Tenant Information", 20, 70);
    doc.setFontSize(12);
    doc.text(`Name: ${payment.tenant}`, 20, 80);
    doc.text(`Property: ${payment.property} - ${payment.unit}`, 20, 90);

    // Payment Information
    doc.setFontSize(14);
    doc.text("Payment Information", 20, 110);
    doc.setFontSize(12);
    doc.text(`Amount: $${payment.amount}`, 20, 120);
    doc.text(`Payment Method: ${payment.paymentMethod}`, 20, 130);
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
      doc.save(`receipt_${payment.id}.pdf`);

      // Then open email client with instructions
      const emailSubject = `Payment Receipt for ${payment.tenant}`;
      const emailBody = `I've downloaded the receipt as a PDF file. Please manually attach the file "receipt_${payment.id}.pdf" from your downloads folder to this email.\n\nPayment Details:\nProperty: ${payment.property} - ${payment.unit}\nAmount: $${payment.amount}\nPayment Date: ${payment.paymentDate}\nPayment Method: ${payment.paymentMethod}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
    } else if (method === "whatsapp") {
      // First save the PDF
      doc.save(`receipt_${payment.id}.pdf`);

      // Then open WhatsApp with a message
      const whatsappText = `Payment Receipt for ${payment.tenant}

I've downloaded the receipt as a PDF file. Please manually attach the file "receipt_${payment.id}.pdf" from your downloads folder to this message.

Payment Details:
Property: ${payment.property} - ${payment.unit}
Amount: $${payment.amount}
Payment Date: ${payment.paymentDate}
Payment Method: ${payment.paymentMethod}`;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
        "_blank"
      );
    }
  };

  const handleRecordPayment = (formData) => {
    const newPayment = {
      id: Date.now(),
      tenant: formData.tenant,
      property: formData.property,
      unit: formData.unit,
      amount: parseFloat(formData.amount),
      dueDate: formData.paymentDate,
      status: "Paid",
      paymentDate: formData.paymentDate,
      paymentMethod: formData.paymentMethod,
    };

    setPayments((prevPayments) => [newPayment, ...prevPayments]);
    setIsRecordPaymentModalOpen(false);
  };

  // Add loading state to prevent hydration errors
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
        <button
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
          onClick={() =>
            router.push(
              `/auth/signin?role=landlord&next=${encodeURIComponent(pathname)}`
            )
          }
        >
          Proceed
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        {/* Site header */}
        <Header toggleSidebar={toggleSidebar} />

        <main className="grow">
          <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-8 w-full">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6 text-[#0d9488]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                  </svg>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Payments
                  </h1>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                  onClick={() => setIsRecordPaymentModalOpen(true)}
                  className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto"
                >
                  Record Payment
                </button>
              </div>
            </div>

            {/* Search bar and filters */}
            <PaymentFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              propertyFilter={propertyFilter}
              setPropertyFilter={setPropertyFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              paymentMethodFilter={paymentMethodFilter}
              setPaymentMethodFilter={setPaymentMethodFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              propertyOptions={[
                "Sunset Apartments",
                "Mountain View Condos",
                "Riverside Townhomes",
                "Downtown Lofts",
                "Garden Villas",
              ]}
            />

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
                              {payment.tenant}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {payment.property} - {payment.unit || "N/A"}
                            </p>
                          </div>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-4 ${getStatusColor(
                              payment.status
                            )}`}
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
                              ${payment.amount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">
                              Due Date:
                            </span>
                            <span className="ml-1 text-slate-900 dark:text-slate-100">
                              {payment.dueDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">
                              Payment Date:
                            </span>
                            <span className="ml-1 text-slate-900 dark:text-slate-100">
                              {payment.paymentDate || "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">
                              Method:
                            </span>
                            <span className="ml-1 text-slate-900 dark:text-slate-100">
                              {payment.paymentMethod || "-"}
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
                              Tenant
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
                              Date
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
                              Payment Method
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
                                {payment.tenant}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {payment.property}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {payment.unit || "-"}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                ${payment.amount.toLocaleString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {payment.dueDate}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                <span
                                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                    payment.status
                                  )}`}
                                >
                                  {payment.status}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {payment.paymentMethod || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
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
            </div>
          </div>
        </main>
      </div>

      {/* Payment Detail Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
      >
        {selectedPayment && (
          <>
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Payment Details
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Payment ID: {selectedPayment.id}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 overflow-y-auto flex-grow">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Tenant Information
                  </h4>
                  <dl className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {selectedPayment.tenant}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Property
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {selectedPayment.property} - {selectedPayment.unit}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Payment Information
                  </h4>
                  <dl className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Amount
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        ${selectedPayment.amount}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Due Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {selectedPayment.dueDate}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                            selectedPayment.status
                          )}`}
                        >
                          {selectedPayment.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Payment Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {selectedPayment.paymentDate || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Payment Method
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {selectedPayment.paymentMethod || "-"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              {selectedPayment.status === "Paid" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const doc = generateReceiptPDF(selectedPayment);
                      doc.save(`receipt_${selectedPayment.id}.pdf`);
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:focus:ring-offset-gray-800 w-full sm:w-auto"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    onClick={() => {
                      const doc = generateReceiptPDF(selectedPayment);
                      doc.save(`receipt_${selectedPayment.id}.pdf`);
                      const emailSubject = `Payment Receipt for ${selectedPayment.tenant}`;
                      const emailBody = `I've downloaded the receipt as a PDF file. Please manually attach the file \"receipt_${selectedPayment.id}.pdf\" from your downloads folder to this email.\n\nPayment Details:\nProperty: ${selectedPayment.property} - ${selectedPayment.unit}\nAmount: $${selectedPayment.amount}\nPayment Date: ${selectedPayment.paymentDate}\nPayment Method: ${selectedPayment.paymentMethod}`;
                      window.location.href = `mailto:?subject=${encodeURIComponent(
                        emailSubject
                      )}&body=${encodeURIComponent(emailBody)}`;
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 w-full sm:w-auto"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    onClick={() => {
                      const doc = generateReceiptPDF(selectedPayment);
                      doc.save(`receipt_${selectedPayment.id}.pdf`);
                      const whatsappText = `Payment Receipt for ${selectedPayment.tenant}

I've downloaded the receipt as a PDF file. Please manually attach the file \"receipt_${selectedPayment.id}.pdf\" from your downloads folder to this message.

Payment Details:
Property: ${selectedPayment.property} - ${selectedPayment.unit}
Amount: $${selectedPayment.amount}
Payment Date: ${selectedPayment.paymentDate}
Payment Method: ${selectedPayment.paymentMethod}`;
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(
                          whatsappText
                        )}`,
                        "_blank"
                      );
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 w-full sm:w-auto"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9 8s9 3.582 9 8z"
                      />
                    </svg>
                    Share via WhatsApp
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
      >
        <RecordPaymentForm
          onSubmit={handleRecordPayment}
          onClose={() => setIsRecordPaymentModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Payments;


