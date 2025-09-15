"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TenantHeader from "../../../partials/tenant/TenantHeader.jsx";
import TenantSidebar from "../../../partials/tenant/TenantSidebar.jsx";
import MaintenanceTable from "../../../components/tenant/maintenance/MaintenanceTable.jsx";
import NewRequestModal from "../../../components/tenant/maintenance/NewRequestModal.jsx";
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
  const router = useRouter();
  const queryClient = useQueryClient();

  // React Query for fetching maintenance requests
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
            "No tenant profile found. Please contact your landlord to set up your tenancy."
          );
        }
        throw error;
      }
    },
    enabled: isAuthenticated(),
  });

  const requests = requestsData || [];

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

  // Handle error state from React Query
  const error = queryError ? queryError.message : null;

  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="mb-6">You must be signed in to access this page.</p>
        <Link
          href="/auth/signin?next=/tenant/maintenance"
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Proceed to Sign In
        </Link>
      </div>
    );
  }

  const handleCreateRequest = async (formData) => {
    setFormErrors({});

    // Validate form data
    const validation = validateMaintenanceRequest(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    createRequestMutation.mutate(formData);
  };

  const priorities = ["Low", "Medium", "High", "Emergency"];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter and sort requests
  const filteredRequests = requests.filter((request) => {
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

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortOrder) {
      case "latest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "priority":
        const priorityOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
  };

  const closeRequestDetails = () => {
    setSelectedRequest(null);
  };

  // Check if tenant has multiple properties (for now, we'll assume single property)
  const hasMultipleProperties = false;

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        <TenantHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4">
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Maintenance Requests
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Submit and track maintenance requests for your rental property
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 dark:text-red-300">
                    {error &&
                    error.toLowerCase().includes("tenant profile not found")
                      ? "No tenant profile found. Please contact your landlord to set up your tenancy."
                      : error}
                  </span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search and Filters */}
              <div className="flex flex-col gap-4 flex-1 w-full lg:w-auto">
                {/* Search */}
                <div className="relative w-full lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="min-w-[140px] pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="min-w-[140px] pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 text-sm"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="min-w-[140px] pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 text-sm"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </div>

              {/* New Request Button */}
              <button
                onClick={() => setShowNewRequestModal(true)}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </button>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              {sortedRequests.length} request
              {sortedRequests.length !== 1 ? "s" : ""} found
            </div>

            {/* Maintenance Table */}
            {sortedRequests.length > 0 ? (
              <MaintenanceTable
                requests={sortedRequests.map((request) => ({
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
            ) : (
              <div className="text-center py-12">
                <div className="text-slate-400 dark:text-slate-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    No maintenance requests found
                  </p>
                  <p className="text-sm">
                    {error &&
                    error.toLowerCase().includes("tenant profile not found")
                      ? "Please contact your landlord to set up your tenancy."
                      : "Create your first maintenance request to get started"}
                  </p>
                </div>
                {!error ||
                !error.toLowerCase().includes("tenant profile not found") ? (
                  <button
                    onClick={() => setShowNewRequestModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
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
