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
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [itemsPerPage] = useState(10);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequestForAction, setSelectedRequestForAction] =
    useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

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
    enabled: !!isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Reduce retries for faster failure
  });

  const requests = requestsData || [];

  // Memoize expensive filtering and sorting operations
  const filteredAndSortedRequests = useMemo(() => {
    if (!requests.length) return [];

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
      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProperty &&
        matchesDate
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
    sortOrder,
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

  if (!isAuthenticated()) {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar - even in unauthenticated state to maintain consistency */}
        <LandlordSidebar sidebarOpen={false} setSidebarOpen={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 lg:ml-64">
          <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
          <p className="mb-6">You must be signed in to access this page.</p>
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
    );
  }

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPageInputValue(pageNumber.toString());
  };
  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setPageInputValue(value);
    const page = parseInt(value);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
  };
  const handlePageInputBlur = () => {
    const page = parseInt(pageInputValue);
    if (page < 1) {
      setPageInputValue("1");
      handlePageChange(1);
    } else if (page > totalPages) {
      setPageInputValue(totalPages.toString());
      handlePageChange(totalPages);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
  };

  const handleAssignClick = (request) => {
    setSelectedRequestForAction(request);
    setShowAssignModal(true);
  };

  const handleStatusClick = (request) => {
    setSelectedRequestForAction(request);
    setShowStatusModal(true);
  };

  const handleDeleteClick = (request) => {
    setSelectedRequestForAction(request);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAssignModal(false);
    setShowStatusModal(false);
    setShowDeleteModal(false);
    setSelectedRequestForAction(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <LandlordSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900 lg:ml-64">
          <LandlordHeader toggleSidebar={toggleSidebar} />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <LandlordSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-900 lg:ml-64">
        {/* Site header */}
        <LandlordHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-6 lg:py-8 overflow-auto">
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Maintenance Requests
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage maintenance requests from your tenants
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 dark:text-red-300">
                    {error}
                  </span>
                </div>
              </div>
            )}

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
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            {/* Results Count */}
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              {filteredAndSortedRequests.length} request
              {filteredAndSortedRequests.length !== 1 ? "s" : ""} found
            </div>

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
                  <div className="text-slate-400 dark:text-slate-500 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">
                      No maintenance requests found
                    </p>
                    <p className="text-sm">
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
  );
};

export default LandlordMaintenance;
