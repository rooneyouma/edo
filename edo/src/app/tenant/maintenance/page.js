"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TenantHeader from "../../../partials/tenant/TenantHeader.jsx";
import TenantSidebar from "../../../partials/tenant/TenantSidebar.jsx";
import MaintenanceTable from "../../../components/tenant/maintenance/MaintenanceTable.jsx";
import NewRequestModal from "../../../components/tenant/maintenance/NewRequestModal.jsx";
import TenantMaintenanceFilters from "../../../components/tenant/maintenance/TenantMaintenanceFilters.jsx";
import RequestDetailsModal from "../../../components/tenant/maintenance/RequestDetailsModal.jsx";
import {
  getStatusColor,
  getPriorityColor,
  getTenantMaintenanceRequests,
  createMaintenanceRequest,
  formatDate,
  validateMaintenanceRequest,
} from "../../../utils/maintenanceUtils.js";
import {
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Plus,
  AlertCircle,
} from "lucide-react";
import { isAuthenticated } from "../../../utils/api";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const Maintenance = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    images: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for query parameter to open new request modal
  useEffect(() => {
    if (isClient) {
      const openNewRequest = searchParams.get("openNewRequest");
      if (openNewRequest === "true") {
        setShowNewRequestModal(true);
      }
    }
  }, [isClient, searchParams]);

  // React Query for fetching maintenance requests with optimized settings
  const {
    data: requestsData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["tenant-maintenance-requests"],
    queryFn: async () => {
      try {
        const result = await getTenantMaintenanceRequests();
        if (result.success) {
          return result.data;
        } else {
          throw new Error(
            result.error || "Failed to fetch maintenance requests"
          );
        }
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
        // Handle the specific "tenant profile not found" error
        if (
          error.message &&
          error.message.toLowerCase().includes("tenant profile not found")
        ) {
          throw new Error(
            "No rental property found. Please contact your landlord to set up your tenancy."
          );
        }
        throw error;
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
        searchQuery === "" ||
        request.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        request.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesPriority =
        priorityFilter === "all" ||
        request.priority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort filtered requests
    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "latest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "earliest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "priority":
          const priorityOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });
  }, [requests, searchQuery, statusFilter, priorityFilter, sortOrder]);

  // React Query mutation for creating maintenance requests
  const createRequestMutation = useMutation({
    mutationFn: (formData) => createMaintenanceRequest(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-maintenance-requests"],
      });
      setShowNewRequestModal(false);
      setFormData({
        subject: "",
        description: "",
        priority: "medium",
        images: [],
      });
      setFormErrors({});
    },
    onError: (error) => {
      console.error("Error creating maintenance request:", error);
    },
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleCreateRequest = useCallback(
    async (formData) => {
      setFormErrors({});

      // Validate form data
      const validation = validateMaintenanceRequest(formData);
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }

      createRequestMutation.mutate(formData);
    },
    [createRequestMutation]
  );

  const handleRequestClick = useCallback((request) => {
    setSelectedRequest(request);
  }, []);

  const closeRequestDetails = useCallback(() => {
    setSelectedRequest(null);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  // Handle error state from React Query
  const error = queryError ? queryError.message : null;

  const priorities = ["Low", "Medium", "High", "Emergency"];

  // Check if tenant has multiple properties (for now, we'll assume single property)
  const hasMultipleProperties = false;

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="mb-6">You must be signed in to access this page.</p>
        <Link
          href="/auth/signin?role=tenant&next=/tenant/maintenance"
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Proceed to Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="lg:ml-64">
            <TenantHeader toggleSidebar={toggleSidebar} />
          </div>
          <main className="flex-1 p-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        <TenantHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 py-4 sm:py-6 lg:py-8 overflow-auto">
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-800 text-slate-900 mb-2">
                Maintenance Requests
              </h1>
              <p className="text-slate-600 text-slate-500 text-sm sm:text-base">
                Submit and track maintenance requests for your rental property
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg bg-red-50 border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-red-700 text-red-700 text-sm">
                    {error &&
                    error.toLowerCase().includes("rental property not found")
                      ? "No rental property found. Please contact your landlord to set up your tenancy."
                      : error}
                  </span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
                {/* Search and Filters */}
                <div className="w-full sm:max-w-3xl">
                  <TenantMaintenanceFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    priorityFilter={priorityFilter}
                    setPriorityFilter={setPriorityFilter}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                  />
                </div>

                {/* New Request Button */}
                <button
                  onClick={() => setShowNewRequestModal(true)}
                  className="flex items-center w-full sm:w-auto justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-slate-600 text-slate-500">
              {filteredAndSortedRequests.length} request
              {filteredAndSortedRequests.length !== 1 ? "s" : ""} found
            </div>

            {/* Maintenance Table */}
            {filteredAndSortedRequests.length > 0 ? (
              <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <MaintenanceTable
                    requests={filteredAndSortedRequests.map((request) => ({
                      id: request.id,
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
                    hasMultipleProperties={hasMultipleProperties}
                    onRequestClick={handleRequestClick}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-slate-400 dark:text-slate-500 mb-4">
                  <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4" />
                  <p className="text-base sm:text-lg font-medium">
                    No maintenance requests found
                  </p>
                  <p className="text-sm mt-1">
                    {error &&
                    error.toLowerCase().includes("rental property not found")
                      ? "Please contact your landlord to set up your tenancy."
                      : "Create your first maintenance request to get started"}
                  </p>
                </div>
                {!error ||
                !error.toLowerCase().includes("rental property not found") ? (
                  <button
                    onClick={() => setShowNewRequestModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Request
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <NewRequestModal
          isOpen={showNewRequestModal}
          onClose={() => setShowNewRequestModal(false)}
          onSubmit={handleCreateRequest}
          formData={formData}
          setFormData={setFormData}
          errors={formErrors}
          submitting={createRequestMutation.isLoading}
        />
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={closeRequestDetails}
        />
      )}
    </div>
  );
};

export default Maintenance;
