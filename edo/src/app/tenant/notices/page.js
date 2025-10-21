"use client";

import React, { useState, useEffect } from "react";
import TenantHeader from "@/partials/tenant/TenantHeader.jsx";
import TenantSidebar from "@/partials/tenant/TenantSidebar.jsx";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, Filter, ChevronDown } from "lucide-react";
import { isAuthenticated } from "@/utils/api";
import { apiRequest } from "@/utils/api";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StyledAlert from "@/components/ui/StyledAlert"; // Keep the import for future use

const Notices = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVacateForm, setShowVacateForm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showVacateModal, setShowVacateModal] = useState(false);
  const [selectedVacateRequest, setSelectedVacateRequest] = useState(null);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // Add these new state variables at the top with other state declarations
  const [lastSubmissionTime, setLastSubmissionTime] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requestToWithdraw, setRequestToWithdraw] = useState(null);
  const [formError, setFormError] = useState(""); // Add state for form validation errors
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

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

  // State for tenant's properties and vacate requests
  const [tenantProperties, setTenantProperties] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    property: "",
    moveOutDate: "",
    reason: "",
  });

  // Add state for search, filter, and sort
  const [vacateSearch, setVacateSearch] = useState("");
  const [vacateStatusFilter, setVacateStatusFilter] = useState("all");
  const [vacateSortOrder, setVacateSortOrder] = useState("latest");
  const [vacateTimeFilter, setVacateTimeFilter] = useState("all");
  const [showVacateFilters, setShowVacateFilters] = useState(false);

  // Fetch tenant properties
  useEffect(() => {
    const fetchTenantProperties = async () => {
      try {
        const data = await apiRequest("/tenant/rentals/", { method: "GET" });
        if (data.rentals && data.rentals.length > 0) {
          const properties = data.rentals.map((rental) => ({
            id: rental.id,
            name: rental.property_name,
            unit: rental.unit_number,
            propertyId: rental.property_id,
            unitId: rental.unit_id,
          }));
          setTenantProperties(properties);

          // Set default property if only one
          if (properties.length === 1) {
            setFormData((prev) => ({
              ...prev,
              property: properties[0].id,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load tenant properties:", err);
      }
    };

    if (isAuthenticated()) {
      fetchTenantProperties();
    }
  }, []);

  // Use React Query for fetching notices
  const {
    data: notices = [],
    isLoading: loadingNotices,
    error: noticesError,
  } = useQuery({
    queryKey: ["tenantNotices"],
    queryFn: async () => {
      const data = await apiRequest("/notices/", { method: "GET" });
      const noticesData = Array.isArray(data) ? data : data?.results || [];
      return Array.isArray(noticesData)
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
        : [];
    },
    enabled: isAuthenticated(),
  });

  // Use React Query for fetching vacate requests
  const {
    data: vacateRequests = [],
    isLoading: vacateRequestsLoading,
    error: vacateRequestsError,
  } = useQuery({
    queryKey: ["vacateRequests"],
    queryFn: async () => {
      const data = await apiRequest("/vacate-requests/", { method: "GET" });
      if (Array.isArray(data)) {
        return data.map((request) => ({
          id: request.id,
          property: request.property_name,
          unit: request.unit_number,
          requestDate: request.created_at
            ? new Date(request.created_at).toLocaleDateString()
            : "",
          moveOutDate: request.move_out_date,
          reason: request.reason,
          status:
            request.status.charAt(0).toUpperCase() + request.status.slice(1), // Capitalize first letter
        }));
      }
      return [];
    },
    enabled: isAuthenticated(),
  });

  const validateSubmission = () => {
    const now = new Date();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    // Clear any previous form error
    setFormError("");

    // Check if there's an existing pending request
    const hasPendingRequest = vacateRequests.some(
      (request) => request.status.toLowerCase() === "pending"
    );

    if (hasPendingRequest) {
      setFormError(
        "You already have a pending vacate request. Please wait for it to be processed or withdraw it before submitting a new one."
      );
      return false;
    }

    // Check submission frequency
    if (lastSubmissionTime) {
      const timeSinceLastSubmission = now - new Date(lastSubmissionTime);

      // Prevent more than 3 submissions in 24 hours
      if (submissionCount >= 3 && timeSinceLastSubmission < twentyFourHours) {
        setFormError(
          "You have reached the maximum number of submissions for today. Please try again tomorrow."
        );
        return false;
      }

      // Reset submission count after 24 hours
      if (timeSinceLastSubmission >= twentyFourHours) {
        setSubmissionCount(0);
      }
    }

    // Validate move-out date
    const moveOutDate = new Date(formData.moveOutDate);
    const minimumNotice = 30; // days
    const today = new Date();

    if (moveOutDate < today) {
      setFormError("Move-out date cannot be in the past.");
      return false;
    }

    const daysNotice = Math.ceil((moveOutDate - today) / (1000 * 60 * 60 * 24));
    if (daysNotice < minimumNotice) {
      setFormError(
        `Please provide at least ${minimumNotice} days notice for moving out.`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the submission
    if (!validateSubmission()) {
      return;
    }

    // Find the selected property
    const selectedProperty = tenantProperties.find(
      (p) => p.id === parseInt(formData.property)
    );

    if (!selectedProperty) {
      console.error("Selected property not found");
      return;
    }

    // Update submission tracking
    setSubmissionCount((prev) => prev + 1);
    setLastSubmissionTime(new Date().toISOString());

    // Prepare data for submission
    const requestData = {
      move_out_date: formData.moveOutDate,
      reason: formData.reason,
    };

    // Use React Query mutation to submit the request
    createVacateRequestMutation.mutate(requestData);
  };

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
      // Exclude withdrawn requests from tenant view after landlord action
      if (request.status.toLowerCase() === "withdrawn") {
        return false;
      }

      const matchesSearch =
        request.property.toLowerCase().includes(vacateSearch.toLowerCase()) ||
        request.unit.toLowerCase().includes(vacateSearch.toLowerCase()) ||
        (request.reason &&
          request.reason.toLowerCase().includes(vacateSearch.toLowerCase())) ||
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNoticeTypeStyles = (type) => {
    switch (type) {
      case "eviction":
        return {
          container: "border-red-200",
          badge: "bg-red-100 text-red-800",
          title: "text-red-600",
          button: "text-red-600 hover:text-red-500",
        };
      case "important":
        return {
          container: "border-yellow-200",
          badge: "bg-yellow-100 text-yellow-800",
          title: "text-slate-900",
          button: "text-violet-600 hover:text-violet-500",
        };
      default:
        return {
          container: "border-slate-200",
          badge: "bg-blue-100 text-blue-800",
          title: "text-slate-900",
          button: "text-[#0d9488] hover:text-[#0f766e]",
        };
    }
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setShowNoticeModal(true);
  };

  // Add this function to handle withdraw action
  const handleWithdrawRequest = (requestId) => {
    // Find the request to check its status
    const request = vacateRequests.find((req) => req.id === requestId);

    // Check if the request has already been acted upon by the landlord
    if (
      request &&
      (request.status.toLowerCase() === "approved" ||
        request.status.toLowerCase() === "declined")
    ) {
      alert(
        "This request has already been processed by your landlord and cannot be withdrawn."
      );
      return;
    }

    // Set the request to withdraw and show styled confirmation
    setRequestToWithdraw(requestId);
    setShowConfirmation(true);
  };

  // Function to confirm withdrawal
  const confirmWithdrawal = () => {
    if (requestToWithdraw) {
      withdrawVacateRequestMutation.mutate(requestToWithdraw);
    }
  };

  // Function to cancel withdrawal
  const cancelWithdrawal = () => {
    setShowConfirmation(false);
    setRequestToWithdraw(null);
  };

  // Mutation for submitting vacate requests
  const createVacateRequestMutation = useMutation({
    mutationFn: (requestData) =>
      apiRequest("/vacate-requests/", {
        method: "POST",
        body: JSON.stringify(requestData),
      }),
    onSuccess: (newRequest) => {
      // Update the vacate requests list
      const formattedRequest = {
        id: newRequest.id,
        property: newRequest.property_name,
        unit: newRequest.unit_number,
        requestDate: newRequest.created_at
          ? new Date(newRequest.created_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
        moveOutDate: newRequest.move_out_date,
        reason: newRequest.reason,
        status:
          newRequest.status.charAt(0).toUpperCase() +
          newRequest.status.slice(1),
      };

      // Update the query cache
      queryClient.setQueryData(["vacateRequests"], (oldData = []) => [
        ...oldData,
        formattedRequest,
      ]);

      // Close the form and reset
      setShowVacateForm(false);
      setFormData({
        property: tenantProperties.length === 1 ? tenantProperties[0].id : "",
        moveOutDate: "",
        reason: "",
      });
      // Clear any form error
      setFormError("");
    },
    onError: (error) => {
      console.error("Failed to submit vacate request:", error);
      // Display backend validation errors as styled messages
      // First check if the response is a direct array
      if (Array.isArray(error.response)) {
        setFormError(error.response[0]); // Take the first error message from the array
      } else if (error && error.message) {
        setFormError(error.message);
      } else if (error && error.response) {
        if (typeof error.response === "object") {
          // Handle object with detail property
          if (error.response.detail) {
            setFormError(error.response.detail);
          } else if (Array.isArray(error.response.non_field_errors)) {
            // Handle Django REST Framework validation errors
            setFormError(error.response.non_field_errors[0]);
          } else {
            // Handle other object formats
            const errorMessages = Object.values(error.response).flat();
            setFormError(
              Array.isArray(errorMessages)
                ? errorMessages[0]
                : errorMessages.join(" ")
            );
          }
        } else {
          setFormError(error.response);
        }
      } else {
        setFormError("Failed to submit vacate request. Please try again.");
      }
    },
  });

  // Mutation for withdrawing vacate requests
  const withdrawVacateRequestMutation = useMutation({
    mutationFn: (requestId) => {
      return apiRequest(`/vacate-requests/${requestId}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: "withdrawn" }),
      });
    },
    onSuccess: () => {
      // Invalidate vacate requests query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["vacateRequests"] });
      setShowVacateModal(false);
      setShowConfirmation(false); // Close confirmation modal
    },
    onError: (error) => {
      console.error("Failed to withdraw vacate request:", error);
      // You might want to show an error message to the user here
      setShowConfirmation(false); // Close confirmation modal even on error
    },
  });

  // Authentication and loading checks
  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
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

  if (loadingNotices) return <div>Loading notices...</div>;
  if (noticesError) return <div>Failed to load notices</div>;

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
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TenantHeader toggleSidebar={toggleSidebar} />
          {/* Main content */}
          <main className="flex-1 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-slate-900">
                    Notices
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 text-slate-500">
                    {isExpandedView
                      ? "All notices and announcements"
                      : "Recent notices and announcements"}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => setIsExpandedView(!isExpandedView)}
                    className="inline-flex items-center justify-center px-3 py-2 border border-[#0d9488] text-xs sm:text-sm font-medium rounded-md text-[#0d9488] hover:bg-[#0d9488]/10 text-[#0d9488] hover:bg-[#0d9488]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto"
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
                    className={`bg-white bg-white rounded-lg shadow-sm border ${styles.container} cursor-pointer hover:shadow-md transition-shadow duration-200`}
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
                                ? "bg-red-100 bg-red-100"
                                : notice.type === "important"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                            }`}
                          >
                            <svg
                              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                notice.type === "eviction"
                                  ? "text-red-600"
                                  : notice.type === "important"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
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
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Urgent
                              </span>
                            )}
                          </div>
                          <span className="text-xs sm:text-sm text-slate-500">
                            {notice.date}
                          </span>
                        </div>
                        <h3
                          className={`mt-3 sm:mt-4 text-base sm:text-lg font-medium ${styles.title}`}
                        >
                          {notice.title}
                        </h3>
                        <p
                          className={`mt-2 text-xs sm:text-sm text-slate-500 text-slate-500 ${
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
                          <span className="text-xs sm:text-sm text-slate-500">
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
              <div className="fixed inset-0 bg-gray-500/50 z-40">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all mx-auto w-[95%] max-w-lg sm:my-8 sm:w-full sm:p-6">
                      <div className="absolute right-0 top-0 pr-4 pt-4">
                        <button
                          type="button"
                          className="rounded-md bg-white bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
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
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
                          <p className="mt-1 text-sm text-slate-500">
                            Posted {selectedNotice.date}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6">
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-slate-600 text-sm sm:text-base">
                            {selectedNotice.content}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <span className="text-sm text-slate-500">
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
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2 w-full sm:w-auto"
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
              <h2 className="text-lg font-medium text-slate-900 text-slate-900 mb-4">
                Vacate Notices
              </h2>

              {/* Add the 30-day notice badge here */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <svg
                    className="mr-1.5 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Minimum 30 days notice required
                </span>
              </div>

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
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] text-sm sm:text-sm"
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
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                  >
                    <Filter className="h-4 w-4 mr-1 sm:mr-2" />
                    Filter
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
                        vacateSortOrder === "latest" ? "earliest" : "latest"
                      )
                    }
                    className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                  >
                    <ArrowUpDown className="h-4 w-4 mr-1 sm:mr-2" />
                    {vacateSortOrder === "latest" ? "Latest" : "Earliest"}
                  </button>
                  {/* Desktop: Submit Vacate Notice button in controls */}
                  <button
                    type="button"
                    onClick={() => setShowVacateForm(true)}
                    className="hidden sm:inline-flex items-center px-3 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-[#0d9488]"
                  >
                    Submit Vacate Notice
                  </button>
                </div>
              </div>
              {showVacateFilters && (
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-lg shadow border border-gray-200">
                  <div>
                    <select
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488]"
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
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm focus:border-[#0d9488] focus:ring-[#0d9488]"
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
                {vacateRequestsLoading ? (
                  <div className="text-center text-gray-500 py-8">
                    Loading vacate requests...
                  </div>
                ) : (
                  filteredVacateRequests.map((request) => (
                    <div
                      key={request.id}
                      className="w-full bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-3 cursor-pointer hover:ring-[#0d9488] transition"
                      onClick={() => {
                        setSelectedVacateRequest(request);
                        setShowVacateModal(true);
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-gray-900 truncate">
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
                        <div className="text-xs text-gray-600">
                          Request Date:{" "}
                          <span className="font-medium text-gray-900">
                            {request.requestDate}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Move-Out Date:{" "}
                          <span className="font-medium text-gray-900">
                            {request.moveOutDate}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 sm:col-span-3">
                          <span className="font-medium">Reason:</span>{" "}
                          <span className="text-gray-900">
                            {request.reason}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {!vacateRequestsLoading &&
                  filteredVacateRequests.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
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
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="relative transform overflow-hidden rounded-lg bg-white bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all mx-auto w-[95%] max-w-lg sm:my-8 sm:w-full sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => {
                      setShowVacateForm(false);
                      setFormError(""); // Clear error when closing
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
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Submit Vacate Notice
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Please provide the details for your vacate notice.
                    </p>
                  </div>
                </div>

                {/* Add 30-day notice badge inside the form modal */}
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <svg
                      className="mr-1.5 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Minimum 30 days notice required
                  </span>
                </div>

                {/* Form validation error message */}
                {formError && (
                  <div className="mt-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{formError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {tenantProperties.length > 1 && (
                    <div>
                      <label
                        htmlFor="property"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Property
                      </label>
                      <select
                        id="property"
                        name="property"
                        value={formData.property}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
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
                      className="block text-sm font-medium text-gray-700 mb-1"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reason"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Reason for Vacating (Optional)
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      rows={3}
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
                      placeholder="Please provide a detailed reason for vacating..."
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2"
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

      {/* Styled Confirmation Modal for Withdrawal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="relative transform overflow-hidden rounded-lg bg-white bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all mx-auto w-[95%] max-w-lg sm:my-8 sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Confirm Withdrawal
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Are you sure you want to withdraw this vacate request?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={confirmWithdrawal}
                  >
                    Withdraw
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={cancelWithdrawal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vacate Request Details Modal */}
      {showVacateModal && selectedVacateRequest && (
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="relative transform overflow-hidden rounded-lg bg-white bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all mx-auto w-[95%] max-w-lg sm:my-8 sm:w-full sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
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
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Vacate Notice Details
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted on {selectedVacateRequest.requestDate}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">
                      Property & Unit
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedVacateRequest.property} -{" "}
                      {selectedVacateRequest.unit}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Move-Out Date
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedVacateRequest.moveOutDate}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Reason
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedVacateRequest.reason || "No reason provided"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
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

                <div className="mt-6 flex justify-end space-x-3">
                  {selectedVacateRequest.status.toLowerCase() === "pending" && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={() =>
                        handleWithdrawRequest(selectedVacateRequest.id)
                      }
                    >
                      Withdraw Request
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2"
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
