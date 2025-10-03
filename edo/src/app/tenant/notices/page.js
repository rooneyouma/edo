"use client";

import React, { useState, useEffect } from "react";
import TenantHeader from "../../../partials/tenant/TenantHeader.jsx";
import TenantSidebar from "../../../partials/tenant/TenantSidebar.jsx";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, Filter, ChevronDown } from "lucide-react";
import { isAuthenticated } from "../../../utils/api.js";
import { apiRequest } from "../../../utils/api.js";
import Link from "next/link";

const Notices = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVacateForm, setShowVacateForm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showVacateModal, setShowVacateModal] = useState(false);
  const [selectedVacateRequest, setSelectedVacateRequest] = useState(null);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for query parameter to open vacate notice form
  useEffect(() => {
    if (isClient) {
      const openVacateNotice = searchParams.get("openVacateNotice");
      if (openVacateNotice === "true") {
        setShowVacateForm(true);
      }
    }
  }, [isClient, searchParams]);

  // Mock data for tenant's properties (in a real app, this would come from your API)
  const tenantProperties = [
    { id: 1, name: "Sunset Apartments", unit: "A101" },
    { id: 2, name: "Mountain View Condos", unit: "B202" },
  ];

  // Mock data for vacate requests
  const [vacateRequests, setVacateRequests] = useState([
    {
      id: 1,
      property: "Sunset Apartments",
      unit: "A101",
      requestDate: "2024-03-01",
      moveOutDate: "2024-04-01",
      reason: "Job relocation to another city",
      status: "Pending",
    },
    {
      id: 2,
      property: "Mountain View Condos",
      unit: "B202",
      requestDate: "2024-03-10",
      moveOutDate: "2024-04-15",
      reason: "Family emergency requiring relocation",
      status: "Approved",
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    property: tenantProperties.length === 1 ? tenantProperties[0].id : "",
    moveOutDate: "",
    reason: "",
  });

  // Add state for search, filter, and sort
  const [vacateSearch, setVacateSearch] = useState("");
  const [vacateStatusFilter, setVacateStatusFilter] = useState("all");
  const [vacateSortOrder, setVacateSortOrder] = useState("latest");
  const [vacateTimeFilter, setVacateTimeFilter] = useState("all");
  const [showVacateFilters, setShowVacateFilters] = useState(false);

  // Fetch notices data
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const data = await apiRequest("/notices/", { method: "GET" });
        const noticesData = Array.isArray(data) ? data : data?.results || [];
        setNotices(
          Array.isArray(noticesData)
            ? noticesData.map((notice) => ({
                id: notice?.id ?? Math.random(),
                type: notice?.notice_type || notice?.type || "general",
                title: notice?.title || "",
                content: notice?.message || notice?.content || "",
                date: notice?.date_sent
                  ? new Date(notice.date_sent).toLocaleDateString()
                  : "",
                priority: notice?.priority || "normal",
                from:
                  notice?.from ||
                  (notice?.property && notice.property.name) ||
                  "Property Manager",
                isRead: notice?.isRead || false,
                managerId: notice?.managerId || null,
              }))
            : []
        );
        setError(null);
      } catch (err) {
        setError("Failed to load notices");
        setNotices([]);
      }
      setLoading(false);
    };
    fetchNotices();
  }, []);

  // Helper to check if a date is in a given range
  const isInTimeRange = (dateStr, range) => {
    const date = new Date(dateStr);
    const now = new Date();
    if (range === "today") {
      return date.toDateString() === now.toDateString();
    }
    if (range === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return date >= startOfWeek && date <= endOfWeek;
    }
    if (range === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }
    if (range === "year") {
      return date.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const filteredVacateRequests = vacateRequests
    .filter((request) => {
      const matchesSearch =
        request.property.toLowerCase().includes(vacateSearch.toLowerCase()) ||
        request.unit.toLowerCase().includes(vacateSearch.toLowerCase()) ||
        request.reason.toLowerCase().includes(vacateSearch.toLowerCase()) ||
        request.requestDate
          .toLowerCase()
          .includes(vacateSearch.toLowerCase()) ||
        request.moveOutDate.toLowerCase().includes(vacateSearch.toLowerCase());
      const matchesStatus =
        vacateStatusFilter === "all" ||
        request.status.toLowerCase() === vacateStatusFilter.toLowerCase();
      const matchesTime =
        vacateTimeFilter === "all" ||
        isInTimeRange(request.requestDate, vacateTimeFilter);
      return matchesSearch && matchesStatus && matchesTime;
    })
    .sort((a, b) => {
      const dateA = new Date(a.requestDate);
      const dateB = new Date(b.requestDate);
      return vacateSortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedProperty = tenantProperties.find(
      (p) => p.id === parseInt(formData.property)
    );
    const newRequest = {
      id: vacateRequests.length + 1,
      property: selectedProperty.name,
      unit: selectedProperty.unit,
      requestDate: new Date().toISOString().split("T")[0],
      moveOutDate: formData.moveOutDate,
      reason: formData.reason,
      status: "Pending",
    };
    setVacateRequests((prev) => [...prev, newRequest]);
    setShowVacateForm(false);
    setFormData({
      property: tenantProperties.length === 1 ? tenantProperties[0].id : "",
      moveOutDate: "",
      reason: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getNoticeTypeStyles = (type) => {
    switch (type) {
      case "eviction":
        return {
          container: "border-red-200 dark:border-red-800",
          badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          title: "text-red-600 dark:text-red-400",
          button:
            "text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300",
        };
      case "important":
        return {
          container: "border-yellow-200 dark:border-yellow-800",
          badge:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          title: "text-slate-900 dark:text-slate-100",
          button:
            "text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300",
        };
      default:
        return {
          container: "border-slate-200 dark:border-slate-700",
          badge:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          title: "text-slate-900 dark:text-slate-100",
          button:
            "text-[#0d9488] hover:text-[#0f766e] dark:text-[#0d9488] dark:hover:text-[#0f766e]",
        };
    }
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setShowNoticeModal(true);
  };

  // Authentication and loading checks
  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="mb-6">You must be signed in to access this page.</p>
        <Link
          href="/auth/signin"
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Proceed to Sign In
        </Link>
      </div>
    );
  }

  if (loading) return <div>Loading notices...</div>;
  if (error) return <div>{error}</div>;

  // Sort notices to ensure eviction notices appear first
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.type === "eviction" && b.type !== "eviction") return -1;
    if (a.type !== "eviction" && b.type === "eviction") return 1;
    return 0;
  });

  // Get visible notices based on view mode
  const visibleNotices = isExpandedView
    ? sortedNotices
    : sortedNotices.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex">
        <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TenantHeader toggleSidebar={toggleSidebar} />
          {/* Main content */}
          <main className="flex-1 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Notices
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {isExpandedView
                      ? "All notices and announcements"
                      : "Recent notices and announcements"}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => setIsExpandedView(!isExpandedView)}
                    className="inline-flex items-center justify-center px-3 py-2 border border-[#0d9488] text-xs sm:text-sm font-medium rounded-md text-[#0d9488] hover:bg-[#0d9488]/10 dark:text-[#0d9488] dark:hover:bg-[#0d9488]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto"
                  >
                    {isExpandedView ? "Show Recent" : "View All Notices"}
                  </button>
                </div>
              </div>
            </div>

            {/* Notices grid */}
            <div
              className={`grid gap-4 sm:gap-6 ${
                isExpandedView
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {visibleNotices.map((notice) => {
                const styles = getNoticeTypeStyles(notice.type);
                return (
                  <div
                    key={notice.id}
                    className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border ${styles.container} cursor-pointer hover:shadow-md transition-shadow duration-200`}
                    onClick={() => handleNoticeClick(notice)}
                  >
                    <div
                      className={`p-4 sm:p-6 ${
                        isExpandedView
                          ? "flex flex-col sm:flex-row sm:items-start sm:space-x-4"
                          : ""
                      }`}
                    >
                      {isExpandedView && (
                        <div className="flex-shrink-0 mb-3 sm:mb-0">
                          <div
                            className={`p-2 sm:p-3 rounded-lg ${
                              notice.type === "eviction"
                                ? "bg-red-100 dark:bg-red-900/30"
                                : notice.type === "important"
                                ? "bg-yellow-100 dark:bg-yellow-900/30"
                                : "bg-blue-100 dark:bg-blue-900/30"
                            }`}
                          >
                            <svg
                              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                notice.type === "eviction"
                                  ? "text-red-600 dark:text-red-400"
                                  : notice.type === "important"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-blue-600 dark:text-blue-400"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div
                        className={`flex-1 ${isExpandedView ? "min-w-0" : ""}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}
                            >
                              {notice.type === "eviction"
                                ? "Eviction Notice"
                                : notice.type.charAt(0).toUpperCase() +
                                  notice.type.slice(1)}
                            </span>
                            {notice.priority === "urgent" && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                Urgent
                              </span>
                            )}
                          </div>
                          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {notice.date}
                          </span>
                        </div>
                        <h3
                          className={`mt-3 sm:mt-4 text-base sm:text-lg font-medium ${styles.title}`}
                        >
                          {notice.title}
                        </h3>
                        <p
                          className={`mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 ${
                            isExpandedView
                              ? "whitespace-pre-wrap"
                              : "line-clamp-2"
                          }`}
                        >
                          {notice.content}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                          <button
                            className={`text-xs sm:text-sm font-medium ${styles.button}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNoticeClick(notice);
                            }}
                          >
                            {notice.type === "eviction"
                              ? "View Details"
                              : "Read more"}
                          </button>
                          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            By {notice.from}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notice Details Modal */}
            {showNoticeModal && selectedNotice && (
              <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 w-full">
                      <div className="absolute right-0 top-0 pr-4 pt-4">
                        <button
                          type="button"
                          className="rounded-md bg-white dark:bg-slate-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => setShowNoticeModal(false)}
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
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                getNoticeTypeStyles(selectedNotice.type).badge
                              }`}
                            >
                              {selectedNotice.type === "eviction"
                                ? "Eviction Notice"
                                : selectedNotice.type.charAt(0).toUpperCase() +
                                  selectedNotice.type.slice(1)}
                            </span>
                            {selectedNotice.priority === "urgent" && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                Urgent
                              </span>
                            )}
                          </div>
                          <h3
                            className={`text-lg font-semibold leading-6 ${
                              getNoticeTypeStyles(selectedNotice.type).title
                            }`}
                          >
                            {selectedNotice.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Posted {selectedNotice.date}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6">
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                            {selectedNotice.content}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          From: {selectedNotice.from}
                        </span>
                        <div className="flex flex-col sm:flex-row sm:space-x-3 gap-2">
                          {selectedNotice.type === "eviction" && (
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/tenant/messages?managerId=${selectedNotice.managerId}`
                                )
                              }
                              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full sm:w-auto"
                            >
                              Contact Property Manager
                            </button>
                          )}
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2 w-full sm:w-auto"
                            onClick={() => setShowNoticeModal(false)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vacate Requests Table (now Horizontal Cards) */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                Vacate Notices
              </h2>
              {/* Mobile: Submit Vacate Notice button under title */}
              <div className="block sm:hidden mb-4">
                <button
                  type="button"
                  onClick={() => setShowVacateForm(true)}
                  className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                >
                  Submit Vacate Notice
                </button>
              </div>
              {/* Search, Sort, and Filter Controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] dark:bg-gray-700 dark:text-gray-100 caret-slate-900 dark:caret-slate-100 text-sm sm:text-sm"
                      placeholder="Search by property, unit, or reason..."
                      value={vacateSearch}
                      onChange={(e) => setVacateSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVacateFilters((prev) => !prev)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                  >
                    <Filter className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Filter</span>
                    {showVacateFilters ? (
                      <svg
                        className="h-4 w-4 ml-1 sm:ml-2"
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
                    ) : (
                      <span className="ml-1 sm:ml-2">▼</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setVacateSortOrder(
                        vacateSortOrder === "latest" ? "oldest" : "latest"
                      )
                    }
                    className="inline-flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                  >
                    {typeof ArrowUpDown !== "undefined" ? (
                      <ArrowUpDown className="h-4 w-4 mr-1 sm:mr-2" />
                    ) : (
                      <svg
                        className="h-4 w-4 mr-1 sm:mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 17l-4 4m0 0l-4-4m4 4V3"
                        />
                      </svg>
                    )}
                    <span className="hidden xs:inline">
                      {vacateSortOrder === "latest" ? "Latest" : "Earliest"}
                    </span>
                    <span className="xs:hidden">
                      {vacateSortOrder === "latest" ? "↑" : "↓"}
                    </span>
                  </button>
                  {/* Desktop: Submit Vacate Notice button in controls */}
                  <button
                    type="button"
                    onClick={() => setShowVacateForm(true)}
                    className="hidden sm:inline-flex items-center px-3 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                  >
                    Submit Vacate Notice
                  </button>
                </div>
              </div>
              {showVacateFilters && (
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                  <div>
                    <select
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100"
                      value={vacateStatusFilter}
                      onChange={(e) => setVacateStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                  <div>
                    <select
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100"
                      value={vacateTimeFilter}
                      onChange={(e) => setVacateTimeFilter(e.target.value)}
                    >
                      <option value="all">All Dates</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-4">
                {filteredVacateRequests.map((request) => (
                  <div
                    key={request.id}
                    className="w-full bg-white dark:bg-gray-900 shadow ring-1 ring-black ring-opacity-5 rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-3 cursor-pointer hover:ring-[#0d9488] transition"
                    onClick={() => {
                      setSelectedVacateRequest(request);
                      setShowVacateModal(true);
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {request.property} - {request.unit}
                      </div>
                      <div>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-4 ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Request Date:{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {request.requestDate}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Move-Out Date:{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {request.moveOutDate}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 sm:col-span-3">
                        <span className="font-medium">Reason:</span>{" "}
                        <span className="text-gray-700 dark:text-gray-200">
                          {request.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredVacateRequests.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No vacate requests found.
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Vacate Notice Form Modal */}
      {showVacateForm && (
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40 flex items-center justify-center">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-slate-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowVacateForm(false)}
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
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                      Submit Vacate Notice
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Please provide the details for your vacate notice.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {tenantProperties.length > 1 && (
                    <div>
                      <label
                        htmlFor="property"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Property
                      </label>
                      <select
                        id="property"
                        name="property"
                        value={formData.property}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm py-2 px-3"
                      >
                        <option value="">Select a property</option>
                        {tenantProperties.map((property) => (
                          <option key={property.id} value={property.id}>
                            {property.name} - {property.unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="moveOutDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Move-Out Date
                    </label>
                    <input
                      type="date"
                      id="moveOutDate"
                      name="moveOutDate"
                      value={formData.moveOutDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reason"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Reason for Vacating
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      rows={3}
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm py-2 px-3"
                      placeholder="Please provide a detailed reason for vacating..."
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2"
                      onClick={() => setShowVacateForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#0d9488] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2"
                    >
                      Submit Notice
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vacate Request Details Modal */}
      {showVacateModal && selectedVacateRequest && (
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-slate-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowVacateModal(false)}
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
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                      Vacate Notice Details
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Submitted on {selectedVacateRequest.requestDate}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Property & Unit
                    </h4>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedVacateRequest.property} -{" "}
                      {selectedVacateRequest.unit}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Move-Out Date
                    </h4>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedVacateRequest.moveOutDate}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Reason
                    </h4>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedVacateRequest.reason}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </h4>
                    <p className="mt-1">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                          selectedVacateRequest.status
                        )}`}
                      >
                        {selectedVacateRequest.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2"
                    onClick={() => setShowVacateModal(false)}
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

export default Notices;
