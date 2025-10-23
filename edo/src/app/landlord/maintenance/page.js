"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LandlordSidebar from "../../../partials/dashboard/LandlordSidebar";
import LandlordHeader from "../../../partials/dashboard/LandlordHeader";
import MaintenanceFilters from "../../../components/landlord/maintenance/MaintenanceFilters";
import MaintenanceTable from "../../../components/landlord/maintenance/MaintenanceTable";
import MaintenanceDetailModal from "../../../components/landlord/maintenance/MaintenanceDetailModal";
import DeleteConfirmModal from "../../../components/landlord/maintenance/DeleteConfirmModal";
import AssignModal from "../../../components/landlord/maintenance/AssignModal";
import StatusModal from "../../../components/landlord/maintenance/StatusModal";
import Pagination from "../../../components/landlord/maintenance/Pagination";
import Modal from "../../../partials/Modal";
import { isAuthenticated } from "../../../utils/api";
import { useRouter, usePathname } from "next/navigation";
import {
  getLandlordMaintenanceRequests,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
  formatDate,
  getStatusColor,
  getPriorityColor,
} from "../../../utils/maintenanceUtils";
import { AlertCircle, Search } from "lucide-react";

const LandlordMaintenance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all"); // New filter for assigned/unassigned
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [itemsPerPage] = useState(10);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequestForAction, setSelectedRequestForAction] =
    useState(null);
  // Add mounted state to prevent hydration errors
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // React Query for fetching maintenance requests with optimized settings
  const {
    data: requestsData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["maintenance-requests"],
    queryFn: async () => {
      const result = await getLandlordMaintenanceRequests();
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || "Failed to fetch maintenance requests");
      }
    },
    enabled: mounted && !!isAuthenticated(), // Only fetch when mounted and authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Reduce retries for faster failure
  });

  const requests = requestsData || [];

  // Calculate summary statistics - moved after requestsData is defined
  const summaryStats = useMemo(() => {
    // Return default values when not mounted to prevent hydration issues
    if (!mounted) return { total: 0, unread: 0, assigned: 0, unassigned: 0 };

    // Return default values when requestsData is not available
    if (!requestsData || !requestsData.length)
      return { total: 0, unread: 0, assigned: 0, unassigned: 0 };

    const total = requestsData.length;
    const unread = requestsData.filter(
      (request) => request.status === "pending"
    ).length;
    const assigned = requestsData.filter(
      (request) => request.assigned_to_name
    ).length;
    const unassigned = requestsData.filter(
      (request) => !request.assigned_to_name
    ).length;

    return { total, unread, assigned, unassigned };
  }, [requestsData, mounted]);

  // Memoize expensive filtering and sorting operations
  const filteredAndSortedRequests = useMemo(() => {
    if (!mounted || !requests.length) return [];

    // Filter requests
    const filtered = requests.filter((request) => {
      const matchesSearch =
        request.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.property_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || request.priority === priorityFilter;
      const matchesProperty =
        propertyFilter === "all" || request.property_id === propertyFilter;
      const matchesDate = dateFilter === "all" || true; // Simplified for now
      const matchesAssignment =
        assignmentFilter === "all" ||
        (assignmentFilter === "assigned" && request.assigned_to_name) ||
        (assignmentFilter === "unassigned" && !request.assigned_to_name);
      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProperty &&
        matchesDate &&
        matchesAssignment
      );
    });

    // Sort filtered requests
    return [...filtered].sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOrder === "earliest") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortOrder === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });
  }, [
    requests,
    searchQuery,
    statusFilter,
    priorityFilter,
    propertyFilter,
    dateFilter,
    assignmentFilter, // Add assignmentFilter to dependencies
    sortOrder,
    mounted,
  ]);

  const totalPages = Math.ceil(filteredAndSortedRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredAndSortedRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // React Query mutation for updating maintenance requests
  const updateRequestMutation = useMutation({
    mutationFn: ({ requestId, updateData }) =>
      updateMaintenanceRequest(requestId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
      setShowAssignModal(false);
      setShowStatusModal(false);
      setSelectedRequestForAction(null);
    },
    onError: (error) => {
      console.error("Error updating maintenance request:", error);
    },
  });

  // React Query mutation for deleting maintenance requests
  const deleteRequestMutation = useMutation({
    mutationFn: (requestId) => deleteMaintenanceRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
      setShowDeleteModal(false);
      setSelectedRequestForAction(null);
    },
    onError: (error) => {
      console.error("Error deleting maintenance request:", error);
    },
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleUpdateRequest = useCallback(
    async (requestId, updateData) => {
      updateRequestMutation.mutate({ requestId, updateData });
    },
    [updateRequestMutation]
  );

  const handleDeleteRequest = useCallback(
    async (requestId) => {
      deleteRequestMutation.mutate(requestId);
    },
    [deleteRequestMutation]
  );

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  // Add these missing handler functions
  const handleRequestClick = useCallback((request) => {
    setSelectedRequest(request);
  }, []);

  const handleDeleteClick = useCallback((request) => {
    setSelectedRequestForAction(request);
    setShowDeleteModal(true);
  }, []);

  const handleAssignClick = useCallback((request) => {
    setSelectedRequestForAction(request);
    setShowAssignModal(true);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    setPageInputValue(newPage.toString());
  }, []);

  const closeModals = useCallback(() => {
    setShowAssignModal(false);
    setShowStatusModal(false);
    setShowDeleteModal(false);
    setSelectedRequestForAction(null);
  }, []);

  // Add the missing handler functions
  const handleMarkComplete = useCallback(
    async (request) => {
      handleUpdateRequest(request.id, { status: "completed" });
      setSelectedRequest(null);
    },
    [handleUpdateRequest]
  );

  const handleCancelRequest = useCallback(
    async (request) => {
      handleUpdateRequest(request.id, { status: "cancelled" });
      setSelectedRequest(null);
    },
    [handleUpdateRequest]
  );

  const handleReopenRequest = useCallback(
    async (request) => {
      handleUpdateRequest(request.id, { status: "pending" });
      setSelectedRequest(null);
    },
    [handleUpdateRequest]
  );

  // Handle error state from React Query
  const error = queryError ? queryError.message : null;

  // Check authentication status
  const authenticated = isAuthenticated();

  // If not authenticated, show sign in prompt with consistent structure
  if (!authenticated) {
    return (
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <LandlordSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="lg:ml-64">
            {/* Site header */}
            <LandlordHeader toggleSidebar={toggleSidebar} />

            {/* Main content area */}
            <main className="flex-1 px-4 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-6 lg:py-8 overflow-auto">
              <div className="w-full">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Maintenance Requests
                  </h1>
                </div>
                <div className="w-full">
                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">
                      Sign in required
                    </h2>
                    <p className="mb-6">
                      You must be signed in to access this page.
                    </p>
                    <button
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                      onClick={() =>
                        router.push(
                          `/auth/signin?role=landlord&next=${encodeURIComponent(
                            pathname
                          )}`
                        )
                      }
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <LandlordSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="lg:ml-64">
            <LandlordHeader toggleSidebar={toggleSidebar} />
            <main className="flex-1 px-4 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-6 lg:py-8 overflow-auto">
              <div className="w-full">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Maintenance Requests
                  </h1>
                </div>
                <div className="w-full">
                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <LandlordSidebar sidebarOpen={false} setSidebarOpen={() => {}} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="lg:ml-64">
            {/* Site header */}
            <LandlordHeader toggleSidebar={toggleSidebar} />

            {/* Main content area */}
            <main className="flex-1 px-4 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-6 lg:py-8 overflow-auto">
              <div className="w-full">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Maintenance Requests
                  </h1>
                </div>
                <div className="w-full">
                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <LandlordSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <div className="lg:ml-64">
          {/* Site header */}
          <LandlordHeader toggleSidebar={toggleSidebar} />
          <main className="flex-1 pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-6 lg:py-8 overflow-auto">
            <div>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  Maintenance Requests
                </h1>
                <p className="text-slate-600">
                  Manage maintenance requests from your tenants
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-blue-100 p-2">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Requests
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {summaryStats.total}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-yellow-100 p-2">
                      <svg
                        className="w-6 h-6 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Pending
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {summaryStats.unread}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-2">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Assigned
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {summaryStats.assigned}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-red-100 p-2">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Unassigned
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {summaryStats.unassigned}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <MaintenanceFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                propertyFilter={propertyFilter}
                setPropertyFilter={setPropertyFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                assignmentFilter={assignmentFilter} // Pass new filter
                setAssignmentFilter={setAssignmentFilter} // Pass new filter setter
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />

              {/* Maintenance Table */}
              <div className="mt-8">
                {currentRequests.length > 0 ? (
                  <>
                    <MaintenanceTable
                      requests={currentRequests.map((request) => ({
                        id: request.id,
                        tenant: request.tenant_name,
                        property: request.property_name,
                        unit: request.unit_number,
                        subject: request.subject,
                        description: request.description,
                        priority: request.priority_display,
                        status: request.status_display,
                        date: formatDate(request.created_at),
                        assignedTo: request.assigned_to_name,
                        contact: request.assignee_phone,
                      }))}
                      onRequestClick={handleRequestClick}
                      onDeleteClick={handleDeleteClick}
                      getStatusColor={getStatusColor}
                      getPriorityColor={getPriorityColor}
                    />
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageInputValue={pageInputValue}
                        setPageInputValue={setPageInputValue}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-slate-400 mb-4">
                      <Search className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium text-slate-900">
                        No maintenance requests found
                      </p>
                      <p className="text-sm text-slate-700">
                        Maintenance requests from your tenants will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modals */}
            {selectedRequest && (
              <MaintenanceDetailModal
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onAssignClick={handleAssignClick}
                onMarkComplete={handleMarkComplete}
                onCancel={handleCancelRequest}
                onReopen={handleReopenRequest}
              />
            )}

            {showAssignModal && selectedRequestForAction && (
              <AssignModal
                request={selectedRequestForAction}
                isOpen={showAssignModal}
                onClose={closeModals}
                onAssign={handleUpdateRequest}
                updating={updateRequestMutation.isLoading}
              />
            )}

            {showStatusModal && selectedRequestForAction && (
              <StatusModal
                request={selectedRequestForAction}
                isOpen={showStatusModal}
                onClose={closeModals}
                onSubmit={handleUpdateRequest}
                updating={updateRequestMutation.isLoading}
              />
            )}

            {showDeleteModal && selectedRequestForAction && (
              <DeleteConfirmModal
                request={selectedRequestForAction}
                isOpen={showDeleteModal}
                onClose={closeModals}
                onConfirm={handleDeleteRequest}
                updating={deleteRequestMutation.isLoading}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LandlordMaintenance;
