"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../../partials/dashboard/LandlordSidebar";
import Header from "../../../partials/dashboard/LandlordHeader";
import { useRouter, usePathname } from "next/navigation";
import CreateNoticeForm from "../../../components/landlord/forms/CreateNoticeForm";
import EvictionNoticeForm from "../../../components/landlord/forms/EvictionNoticeForm";
import NoticeFilters from "../../../components/landlord/notices/NoticeFilters";
import VacateRequestFilters from "../../../components/landlord/notices/VacateRequestFilters";
import EvictionNoticeFilters from "../../../components/landlord/notices/EvictionNoticeFilters";
import { isAuthenticated, apiRequest } from "../../../utils/api";
import CustomSelect from "../../../components/ui/CustomSelect";

const Notices = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noticeTypeFilter, setNoticeTypeFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [vacateRequestsPage, setVacateRequestsPage] = useState(1);
  const [vacateRequestsPageInput, setVacateRequestsPageInput] = useState("1");
  const [evictionNoticesPage, setEvictionNoticesPage] = useState(1);
  const [evictionNoticesPageInput, setEvictionNoticesPageInput] = useState("1");
  const [vacateRequestsSearch, setVacateRequestsSearch] = useState("");
  const [vacateRequestsStatusFilter, setVacateRequestsStatusFilter] =
    useState("all");
  const [vacateRequestsPropertyFilter, setVacateRequestsPropertyFilter] =
    useState("All Properties");
  const [evictionNoticesSearch, setEvictionNoticesSearch] = useState("");
  const [evictionNoticesStatusFilter, setEvictionNoticesStatusFilter] =
    useState("all");
  const [evictionNoticesPropertyFilter, setEvictionNoticesPropertyFilter] =
    useState("All Properties");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedVacateRequest, setSelectedVacateRequest] = useState(null);
  const [selectedEvictionNotice, setSelectedEvictionNotice] = useState(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isVacateRequestModalOpen, setIsVacateRequestModalOpen] =
    useState(false);
  const [isEvictionNoticeModalOpen, setIsEvictionNoticeModalOpen] =
    useState(false);
  const [isNewEvictionNoticeModalOpen, setIsNewEvictionNoticeModalOpen] =
    useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noticeToEdit, setNoticeToEdit] = useState(null);
  const [isDeclineReasonModalOpen, setIsDeclineReasonModalOpen] =
    useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [requestToDecline, setRequestToDecline] = useState(null);
  const [newEvictionNotice, setNewEvictionNotice] = useState({
    tenantName: "",
    property: "",
    reason: "",
    moveOutDeadline: "",
  });
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const itemsPerPage = 5;
  const [isCreateNoticeModalOpen, setIsCreateNoticeModalOpen] = useState(false);
  const [noticeSortOrder, setNoticeSortOrder] = useState("latest");
  const [vacateRequestSortOrder, setVacateRequestSortOrder] =
    useState("latest");
  const [evictionNoticeSortOrder, setEvictionNoticeSortOrder] =
    useState("latest");
  const [noticeTab, setNoticeTab] = useState("general");
  const router = useRouter();
  const pathname = usePathname();
  const [createNoticeError, setCreateNoticeError] = useState(null);
  const queryClient = useQueryClient();
  // Add mounted state to prevent hydration errors
  const [mounted, setMounted] = useState(false);

  // React Query for fetching vacate requests
  const {
    data: vacateRequests = [],
    isLoading: loadingVacateRequests,
    error: vacateRequestsError,
  } = useQuery({
    queryKey: ["vacateRequests"],
    queryFn: async () => {
      const data = await apiRequest("/vacate-requests/", { method: "GET" });
      if (Array.isArray(data)) {
        return data.map((request) => ({
          id: request.id,
          tenantName: request.tenant_name,
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
    enabled: mounted && isAuthenticated(), // Only fetch when mounted and authenticated
  });

  // Initialize eviction notices state
  const [evictionNotices, setEvictionNotices] = useState([
    {
      id: 1,
      tenantName: "Alice Lee",
      property: "Sunset Apartments",
      unit: "A101",
      dateSent: "2024-03-28",
      reason: "Rent arrears for 3 months",
      moveOutDeadline: "2024-04-15",
      status: "Acknowledged",
    },
    {
      id: 2,
      tenantName: "Tom Brown",
      property: "Mountain View Condos",
      unit: "B202",
      dateSent: "2024-03-01",
      reason: "Property damage and lease violation",
      moveOutDeadline: "2024-03-20",
      status: "Pending",
    },
    {
      id: 3,
      tenantName: "Mike Wilson",
      property: "Riverside Townhomes",
      unit: "C303",
      dateSent: "2024-03-15",
      reason: "Unauthorized subletting",
      moveOutDeadline: "2024-04-01",
      status: "Pending",
    },
  ]);

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // React Query for fetching notices
  const {
    data: notices = [],
    isLoading: loadingNotices,
    error: noticesQueryError,
  } = useQuery({
    queryKey: ["notices"],
    queryFn: () => apiRequest("/notices/", { method: "GET" }),
    enabled: mounted && isAuthenticated(), // Only fetch when mounted and authenticated
  });

  // React Query mutation for creating notices
  const createNoticeMutation = useMutation({
    mutationFn: (payload) =>
      apiRequest("/notices/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (newNotice) => {
      // Invalidate notices query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      setIsCreateNoticeModalOpen(false);
      setCreateNoticeError(null);
    },
    onError: () => {
      setCreateNoticeError("Failed to create notice. Please try again.");
    },
  });

  // React Query mutation for updating vacate requests
  const updateVacateRequestMutation = useMutation({
    mutationFn: ({ requestId, payload }) =>
      apiRequest(`/vacate-requests/${requestId}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate vacate requests query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["vacateRequests"] });
    },
    onError: (error) => {
      console.error("Failed to update vacate request:", error);
    },
  });

  // React Query mutation for deleting vacate requests
  const deleteVacateRequestMutation = useMutation({
    mutationFn: (requestId) =>
      apiRequest(`/vacate-requests/${requestId}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      // Invalidate vacate requests query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["vacateRequests"] });
    },
    onError: (error) => {
      console.error("Failed to delete vacate request:", error);
    },
  });

  // Handle error state from React Query
  const noticesError = noticesQueryError ? "Could not load notices." : null;

  // Add mock tenant data (in a real app, this would come from your API)
  const mockTenants = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];

  const filteredTenants = mockTenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(tenantSearchQuery.toLowerCase())
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="lg:ml-64">
            {/* Site header */}
            <Header toggleSidebar={toggleSidebar} />

            {/* Main content area */}
            <main className="flex-1 px-4 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-6 lg:py-8 overflow-auto">
              <div className="w-full">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Notices
                  </h1>
                </div>
                <div className="text-center text-gray-500 text-slate-500 mt-12 text-lg">
                  Loading...
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Check authentication status
  const authenticated = isAuthenticated();

  // If not authenticated, show sign in prompt with consistent structure
  if (!authenticated) {
    return (
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="lg:ml-64">
            {/* Site header */}
            <Header toggleSidebar={toggleSidebar} />

            {/* Main content area */}
            <main className="flex-1 px-4 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-6 lg:py-8 overflow-auto">
              <div className="w-full">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Notices
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

  const handleCreateNotice = async (formData) => {
    const basePayload = {
      title: formData.title,
      notice_type: formData.type || "general",
      message: formData.content,
      effective_date: formData.endDate || formData.startDate,
    };

    try {
      if (
        formData.selectedProperties &&
        formData.selectedProperties.length > 0
      ) {
        for (const unitId of formData.selectedProperties) {
          const payload = { ...basePayload, unit: unitId };
          createNoticeMutation.mutate(payload);
        }
      } else if (
        formData.selectedTenants &&
        formData.selectedTenants.length > 0
      ) {
        for (const tenantId of formData.selectedTenants) {
          const payload = { ...basePayload, tenant: tenantId };
          createNoticeMutation.mutate(payload);
        }
      } else {
        createNoticeMutation.mutate(basePayload);
      }
    } catch (err) {
      setCreateNoticeError("Failed to create notice. Please try again.");
    }
  };

  const getTypeColor = (type) => {
    if (!type || typeof type !== "string")
      return "bg-gray-100 text-gray-800 bg-slate-50 text-slate-700";
    switch (type.toLowerCase()) {
      case "rent":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "payment":
        return "bg-green-100 text-green-800";
      case "lease":
        return "bg-[#0d9488]/10 text-[#0d9488]";
      case "utility":
        return "bg-orange-100 text-orange-800";
      case "general":
        return "bg-gray-200 text-gray-800 bg-slate-50 text-slate-700";
      default:
        return "bg-gray-100 text-gray-800 bg-slate-50 text-slate-700";
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800 text-slate-600";

    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "acknowledged":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800 text-slate-600";
    }
  };

  // Filter notices based on search query and filters
  const filteredNotices = notices
    .filter((notice) => {
      const matchesSearch =
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        noticeTypeFilter === "all" ||
        notice.type.toLowerCase() === noticeTypeFilter.toLowerCase();

      const matchesAudience =
        audienceFilter === "all" ||
        (audienceFilter === "allTenants" &&
          notice.audience === "All Tenants") ||
        (audienceFilter === "specificTenants" &&
          notice.tenant &&
          mockTenants.some(
            (tenant) =>
              tenant.name ===
              notice.tenant.first_name + " " + notice.tenant.last_name
          )) ||
        (audienceFilter !== "all" &&
          audienceFilter !== "allTenants" &&
          audienceFilter !== "specificTenants" &&
          notice.audience === audienceFilter);

      return matchesSearch && matchesType && matchesAudience;
    })
    .sort((a, b) => {
      // Handle different possible date field names
      const getDateValue = (notice) => {
        return notice.effective_date || notice.date_sent || notice.date || "";
      };

      const dateA = new Date(getDateValue(a));
      const dateB = new Date(getDateValue(b));

      // Handle invalid dates
      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;

      return noticeSortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPageInputValue(pageNumber.toString());
  };

  const handleVacateRequestAction = (requestId, action) => {
    if (action === "decline" && !declineReason) {
      setRequestToDecline(requestId);
      setIsDeclineReasonModalOpen(true);
      return;
    }

    // Use React Query mutation to update the vacate request
    const payload = {
      status: action === "approve" ? "approved" : "declined",
    };

    if (action === "decline") {
      payload.landlord_response = declineReason;
    }

    updateVacateRequestMutation.mutate(
      { requestId, payload },
      {
        onSuccess: () => {
          // Close the modal after action
          setIsVacateRequestModalOpen(false);
          setIsDeclineReasonModalOpen(false);
          setDeclineReason("");
          setRequestToDecline(null);

          // Update selected request if it's the one being modified
          if (selectedVacateRequest && selectedVacateRequest.id === requestId) {
            setSelectedVacateRequest((prev) => ({
              ...prev,
              status: action === "approve" ? "Approved" : "Declined",
              declineReason: action === "decline" ? declineReason : null,
            }));
          }
        },
        onError: (error) => {
          console.error("Failed to update vacate request:", error);
          // Close the modal even if there's an error
          setIsVacateRequestModalOpen(false);
          setIsDeclineReasonModalOpen(false);
          setDeclineReason("");
          setRequestToDecline(null);
        },
      }
    );
  };

  const handleEvictionNoticeAction = (noticeId, action) => {
    if (action === "edit") {
      // In a real application, you would navigate to edit page or open edit modal
      console.log(`Edit notice ${noticeId}`);
    } else if (action === "delete") {
      // In a real application, you would make an API call to delete
      console.log(`Delete notice ${noticeId}`);
    }
  };

  // Filter and sort vacate requests
  const filteredVacateRequests = vacateRequests
    .filter((request) => {
      // Exclude withdrawn requests from landlord view
      if (request.status === "Withdrawn") {
        return false;
      }

      const matchesSearch =
        request.tenantName
          .toLowerCase()
          .includes(vacateRequestsSearch.toLowerCase()) ||
        request.property
          .toLowerCase()
          .includes(vacateRequestsSearch.toLowerCase()) ||
        request.unit
          .toLowerCase()
          .includes(vacateRequestsSearch.toLowerCase()) ||
        request.reason
          .toLowerCase()
          .includes(vacateRequestsSearch.toLowerCase());
      const matchesStatus =
        vacateRequestsStatusFilter === "all" ||
        request.status === vacateRequestsStatusFilter;
      const matchesProperty =
        vacateRequestsPropertyFilter === "all" ||
        vacateRequestsPropertyFilter === "All Properties" ||
        request.property === vacateRequestsPropertyFilter;
      return matchesSearch && matchesStatus && matchesProperty;
    })
    .sort((a, b) => {
      const dateA = new Date(a.requestDate);
      const dateB = new Date(b.requestDate);
      return vacateRequestSortOrder === "latest"
        ? dateB - dateA
        : dateA - dateB;
    });

  // Filter eviction notices based on search query and filters
  const filteredEvictionNotices = evictionNotices
    .filter((notice) => {
      const matchesSearch =
        notice.tenantName
          .toLowerCase()
          .includes(evictionNoticesSearch.toLowerCase()) ||
        notice.property
          .toLowerCase()
          .includes(evictionNoticesSearch.toLowerCase()) ||
        notice.unit
          .toLowerCase()
          .includes(evictionNoticesSearch.toLowerCase()) ||
        notice.reason
          .toLowerCase()
          .includes(evictionNoticesSearch.toLowerCase());
      const matchesStatus =
        evictionNoticesStatusFilter === "all" ||
        notice.status === evictionNoticesStatusFilter;
      const matchesProperty =
        evictionNoticesPropertyFilter === "all" ||
        evictionNoticesPropertyFilter === "All Properties" ||
        notice.property === evictionNoticesPropertyFilter;
      return matchesSearch && matchesStatus && matchesProperty;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateSent);
      const dateB = new Date(b.dateSent);
      return evictionNoticeSortOrder === "latest"
        ? dateB - dateA
        : dateA - dateB;
    });

  // Get unique property names for filters
  const vacateRequestsProperties = [
    ...new Set(vacateRequests.map((request) => request.property)),
  ];
  const evictionNoticesProperties = [
    ...new Set(evictionNotices.map((notice) => notice.property)),
  ];

  // Calculate pagination for vacate requests
  const totalVacateRequestsPages = Math.ceil(
    filteredVacateRequests.length / itemsPerPage
  );
  const startVacateRequestsIndex = (vacateRequestsPage - 1) * itemsPerPage;
  const endVacateRequestsIndex = startVacateRequestsIndex + itemsPerPage;
  const currentVacateRequests = filteredVacateRequests.slice(
    startVacateRequestsIndex,
    endVacateRequestsIndex
  );

  const handleVacateRequestsPageChange = (pageNumber) => {
    setVacateRequestsPage(pageNumber);
    setVacateRequestsPageInput(pageNumber.toString());
  };

  const handleEvictionNoticesPageChange = (pageNumber) => {
    setEvictionNoticesPage(pageNumber);
    setEvictionNoticesPageInput(pageNumber.toString());
  };

  const truncateText = (text, wordCount = 3) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(" ") + "...";
  };

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/30 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-[95%] max-w-[95vw] sm:w-full sm:max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Add click handler for general notices
  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setIsNoticeModalOpen(true);
  };

  // Add handlers for eviction notice actions
  const handleNewEvictionNotice = () => {
    // In a real application, you would make an API call here
    const newNotice = {
      id: evictionNotices.length + 1,
      ...newEvictionNotice,
      dateSent: new Date().toISOString().split("T")[0],
      status: "Pending",
    };
    setEvictionNotices([newNotice, ...evictionNotices]);
    setNewEvictionNotice({
      tenantName: "",
      property: "",
      reason: "",
      moveOutDeadline: "",
    });
    setIsNewEvictionNoticeModalOpen(false);
  };

  const handleEditNotice = () => {
    // In a real application, you would make an API call here
    setEvictionNotices(
      evictionNotices.map((notice) =>
        notice.id === noticeToEdit.id ? { ...notice, ...noticeToEdit } : notice
      )
    );
    setIsEditModalOpen(false);
    setNoticeToEdit(null);
  };

  const handleDeleteNotice = () => {
    if (noticeToDelete?.type === "notice") {
      // For general notices, we would typically make an API call
      // Since this is a mock implementation, we'll just close the modal
      console.log(`Delete notice with ID: ${noticeToDelete.id}`);
      // In a real app, you would call an API to delete the notice
      // and then invalidate the query to refresh the data
      // queryClient.invalidateQueries({ queryKey: ["notices"] });
    } else if (noticeToDelete?.type === "vacate") {
      // Use React Query mutation to delete the vacate request
      deleteVacateRequestMutation.mutate(noticeToDelete.id);
    } else if (noticeToDelete?.type === "eviction") {
      setEvictionNotices(
        evictionNotices.filter((notice) => notice.id !== noticeToDelete.id)
      );
    }
    setIsDeleteConfirmModalOpen(false);
    setNoticeToDelete(null);
  };

  // Update the new eviction notice form
  const handleTenantSelect = (tenant) => {
    setNewEvictionNotice({
      ...newEvictionNotice,
      tenantName: tenant.name,
      property: tenant.property,
    });
    setShowTenantDropdown(false);
    setTenantSearchQuery("");
  };

  // Update the delete confirmation modal content
  const getDeleteModalContent = () => {
    const isGeneralNotice = noticeToDelete?.type === "notice";
    const isVacateRequest = noticeToDelete?.type === "vacate";
    const isEvictionNotice = noticeToDelete?.type === "eviction";

    return (
      <div className="space-y-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-slate-900">
            Delete{" "}
            {isGeneralNotice
              ? "Notice"
              : isVacateRequest
              ? "Vacate Request"
              : "Eviction Notice"}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 text-slate-500">
              Are you sure you want to delete this{" "}
              {isGeneralNotice
                ? "notice"
                : isVacateRequest
                ? "vacate request"
                : "eviction notice"}
              ? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex space-x-3">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            onClick={handleDeleteNotice}
          >
            Delete
          </button>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 border-gray-300 shadow-sm px-4 py-2 bg-white bg-slate-50 text-base font-medium text-gray-700 text-slate-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:text-sm"
            onClick={() => setIsDeleteConfirmModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Add edit modal content
  const getEditModalContent = () => {
    if (!noticeToEdit) return null;

    // Determine if it's a general notice or eviction notice based on the fields
    // General notices have fields like title, type, message, etc.
    // Eviction notices have fields like tenantName, property, reason, etc.
    const isGeneralNotice = noticeToEdit.title && noticeToEdit.message;

    if (isGeneralNotice) {
      // It's a general notice
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-slate-900">
            Edit Notice
          </h3>
          <CreateNoticeForm
            initialData={noticeToEdit}
            onSubmit={(formData) => {
              // In a real app, you would make an API call here
              // For now, we'll just close the modal
              setIsEditModalOpen(false);
              setNoticeToEdit(null);
            }}
            onClose={() => {
              setIsEditModalOpen(false);
              setNoticeToEdit(null);
            }}
            hideContainer={true}
          />
        </div>
      );
    } else {
      // It's an eviction notice
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-slate-900">
            Edit Eviction Notice
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditNotice();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="edit-tenantName"
                className="block text-sm font-medium text-gray-700 text-slate-600"
              >
                Tenant Name
              </label>
              <input
                type="text"
                id="edit-tenantName"
                value={noticeToEdit.tenantName}
                onChange={(e) =>
                  setNoticeToEdit({
                    ...noticeToEdit,
                    tenantName: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-slate-50 text-slate-900 caret-slate-900 dark:caret-slate-100 py-2 px-3 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-property"
                className="block text-sm font-medium text-gray-700 text-slate-600"
              >
                Property
              </label>
              <input
                type="text"
                id="edit-property"
                value={noticeToEdit.property}
                onChange={(e) =>
                  setNoticeToEdit({ ...noticeToEdit, property: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-slate-50 text-slate-900 caret-slate-900 dark:caret-slate-100 py-2 px-3 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-unit"
                className="block text-sm font-medium text-gray-700 text-slate-600"
              >
                Unit
              </label>
              <input
                type="text"
                id="edit-unit"
                value={noticeToEdit.unit || ""}
                onChange={(e) =>
                  setNoticeToEdit({ ...noticeToEdit, unit: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-slate-50 text-slate-900 caret-slate-900 dark:caret-slate-100 py-2 px-3 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-reason"
                className="block text-sm font-medium text-gray-700 text-slate-600"
              >
                Reason
              </label>
              <textarea
                id="edit-reason"
                value={noticeToEdit.reason}
                onChange={(e) =>
                  setNoticeToEdit({ ...noticeToEdit, reason: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-slate-50 text-slate-900 caret-slate-900 dark:caret-slate-100 py-2 px-3 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-moveOutDeadline"
                className="block text-sm font-medium text-gray-700 text-slate-600"
              >
                Move-out Deadline
              </label>
              <input
                type="date"
                id="edit-moveOutDeadline"
                value={noticeToEdit.moveOutDeadline}
                onChange={(e) =>
                  setNoticeToEdit({
                    ...noticeToEdit,
                    moveOutDeadline: e.target.value,
                  })
                }
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full rounded-md border-gray-300 border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-slate-50 text-slate-900 caret-slate-900 dark:caret-slate-100 py-2 px-3 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-status"
                className="block text-sm font-medium text-gray-700 text-slate-600"
              >
                Status
              </label>
              <CustomSelect
                id="edit-status"
                label="Status"
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "Acknowledged", label: "Acknowledged" },
                ]}
                value={noticeToEdit.status}
                onChange={(value) =>
                  setNoticeToEdit({ ...noticeToEdit, status: value })
                }
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setNoticeToEdit(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] bg-slate-50 border-gray-300 text-slate-900 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      );
    }
  };

  // Update the notice detail modal content
  const getNoticeDetailContent = () => {
    if (!selectedNotice) return null;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 text-slate-900">
              {selectedNotice.title}
            </h3>
            <p className="text-sm text-gray-500 text-slate-500">
              {selectedNotice.effective_date ||
                selectedNotice.date_sent ||
                selectedNotice.date ||
                ""}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 text-slate-500">
              Type
            </h4>
            <p className="mt-1">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                  selectedNotice.notice_type || selectedNotice.type
                )}`}
              >
                {selectedNotice.notice_type || selectedNotice.type || "General"}
              </span>
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 text-slate-500">
              Audience
            </h4>
            <p className="mt-1 text-sm text-gray-900 text-slate-900">
              {selectedNotice.tenant
                ? (selectedNotice.tenant.first_name || "") +
                  " " +
                  (selectedNotice.tenant.last_name || "")
                : "All"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 text-slate-500">
              Message
            </h4>
            <p className="mt-1 text-sm text-gray-900 text-slate-900">
              {selectedNotice.message || ""}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => setIsNoticeModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] bg-slate-50 border-gray-300 text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Calculate pagination for eviction notices
  const totalEvictionNoticesPages = Math.ceil(
    filteredEvictionNotices.length / itemsPerPage
  );
  const startEvictionNoticesIndex = (evictionNoticesPage - 1) * itemsPerPage;
  const endEvictionNoticesIndex = startEvictionNoticesIndex + itemsPerPage;
  const currentEvictionNotices = filteredEvictionNotices.slice(
    startEvictionNoticesIndex,
    endEvictionNoticesIndex
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-screen">
        <div className="lg:ml-64 flex flex-col flex-1">
          {/* Site header */}
          <Header toggleSidebar={toggleSidebar} />

          <main className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 py-4 overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto">
              {/* Page header - Fixed responsiveness */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Notices</h1>
              </div>

              {/* Notices Section - Improved mobile tab navigation */}
              <div className="border-b border-slate-200 mb-6">
                <nav className="-mb-px flex overflow-x-auto scrollbar-none">
                  <div className="flex space-x-4 sm:space-x-6 md:space-x-8 min-w-max px-1">
                    <button
                      onClick={() => setNoticeTab("general")}
                      className={`whitespace-nowrap py-3 md:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-150 ${
                        noticeTab === "general"
                          ? "border-teal-500 text-teal-600"
                          : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                      style={{
                        borderBottomWidth: noticeTab === "general" ? 3 : 2,
                      }}
                    >
                      <span className="hidden sm:inline">General Notices</span>
                      <span className="sm:hidden">General</span>
                    </button>
                    <button
                      onClick={() => setNoticeTab("vacate")}
                      className={`whitespace-nowrap py-3 md:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-150 ${
                        noticeTab === "vacate"
                          ? "border-teal-500 text-teal-600"
                          : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                      style={{
                        borderBottomWidth: noticeTab === "vacate" ? 3 : 2,
                      }}
                    >
                      <span className="hidden sm:inline">Vacate Requests</span>
                      <span className="sm:hidden">Vacate</span>
                    </button>
                    <button
                      onClick={() => setNoticeTab("eviction")}
                      className={`whitespace-nowrap py-3 md:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-150 ${
                        noticeTab === "eviction"
                          ? "border-teal-500 text-teal-600"
                          : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                      style={{
                        borderBottomWidth: noticeTab === "eviction" ? 3 : 2,
                      }}
                    >
                      <span className="hidden sm:inline">Eviction Notices</span>
                      <span className="sm:hidden">Eviction</span>
                    </button>
                  </div>
                </nav>
              </div>

              {/* Conditionally render the content for each tab based on noticeTab */}
              {noticeTab === "general" && (
                <>
                  <div className="mb-8">
                    <div className="sm:flex sm:items-center">
                      <div className="sm:flex-auto">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-lg font-semibold text-gray-900 text-slate-900">
                            General Notices
                          </h2>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                          onClick={() => setIsCreateNoticeModalOpen(true)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto"
                        >
                          <span>Create Notice</span>
                        </button>
                      </div>
                    </div>
                    <NoticeFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      noticeTypeFilter={noticeTypeFilter}
                      setNoticeTypeFilter={setNoticeTypeFilter}
                      audienceFilter={audienceFilter}
                      setAudienceFilter={setAudienceFilter}
                      sortOrder={noticeSortOrder}
                      setSortOrder={setNoticeSortOrder}
                    />
                  </div>
                  {loadingNotices ? (
                    <div className="text-center text-gray-500 text-slate-500 mt-12 text-lg">
                      Loading notices...
                    </div>
                  ) : noticesError ? (
                    <div className="text-center text-red-500 mt-12 text-lg">
                      {noticesError}
                    </div>
                  ) : currentNotices.length === 0 ? (
                    <div className="text-center text-gray-500 text-slate-500 mt-12 text-lg">
                      No notices found.
                    </div>
                  ) : (
                    <>
                      {/* Mobile Card Layout */}
                      <div className="block md:hidden space-y-4">
                        {currentNotices.map((notice) => (
                          <div
                            key={notice.id}
                            onClick={() => handleNoticeClick(notice)}
                            className="bg-white bg-white rounded-lg shadow border border-gray-200 border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-900 text-slate-900 flex-1 pr-2">
                                {notice.title}
                              </h3>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNoticeToEdit(notice);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="text-[#0d9488] hover:text-[#0f766e] p-1"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNoticeToDelete(notice);
                                    setIsDeleteConfirmModalOpen(true);
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1"
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
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 text-slate-500">
                                  Type:
                                </span>
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                                    notice.notice_type || notice.type
                                  )}`}
                                >
                                  {notice.notice_type ||
                                    notice.type ||
                                    "General"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 text-slate-500">
                                  Date:
                                </span>
                                <span className="text-xs text-gray-900 text-slate-900">
                                  {notice.effective_date ||
                                    notice.date_sent ||
                                    notice.date ||
                                    ""}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 text-slate-500">
                                  Audience:
                                </span>
                                <span className="text-xs text-gray-900 text-slate-900">
                                  {notice.tenant
                                    ? (notice.tenant.first_name || "") +
                                      " " +
                                      (notice.tenant.last_name || "")
                                    : "All"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table Layout */}
                      <div className="hidden md:block overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden shadow ring-1 ring-gray-200 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50 bg-white">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 text-slate-900 sm:pl-6"
                                  >
                                    Title
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Type
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Date
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Audience
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {currentNotices.map((notice) => (
                                  <tr
                                    key={notice.id}
                                    onClick={() => handleNoticeClick(notice)}
                                    className="hover:bg-gray-50 cursor-pointer"
                                  >
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 text-slate-900 sm:pl-6">
                                      {notice.title}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                                          notice.notice_type || notice.type
                                        )}`}
                                      >
                                        {notice.notice_type ||
                                          notice.type ||
                                          "General"}
                                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {notice.effective_date ||
                                        notice.date_sent ||
                                        notice.date ||
                                        ""}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {notice.tenant
                                        ? (notice.tenant.first_name || "") +
                                          " " +
                                          (notice.tenant.last_name || "")
                                        : "All"}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                      <div className="flex items-center space-x-3">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setNoticeToEdit(notice);
                                            setIsEditModalOpen(true);
                                          }}
                                          className="text-[#0d9488] hover:text-[#0f766e]"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setNoticeToDelete(notice);
                                            setIsDeleteConfirmModalOpen(true);
                                          }}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Pagination for notices */}
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 border-gray-200 bg-white bg-white px-3 sm:px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-3">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <span className="text-xs text-gray-700 text-slate-700 whitespace-nowrap">
                          Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 text-slate-700 hidden sm:inline">
                            Go to:
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
                            className="w-12 h-7 text-xs text-center rounded border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                </>
              )}

              {noticeTab === "vacate" && (
                <>
                  <div className="mb-8">
                    <div className="sm:flex sm:items-center">
                      <div className="sm:flex-auto">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-lg font-semibold text-gray-900 text-slate-900">
                            Vacate Requests
                          </h2>
                        </div>
                      </div>
                    </div>
                    <VacateRequestFilters
                      searchQuery={vacateRequestsSearch}
                      setSearchQuery={setVacateRequestsSearch}
                      statusFilter={vacateRequestsStatusFilter}
                      setStatusFilter={setVacateRequestsStatusFilter}
                      propertyFilter={vacateRequestsPropertyFilter}
                      setPropertyFilter={setVacateRequestsPropertyFilter}
                      sortOrder={vacateRequestSortOrder}
                      setSortOrder={setVacateRequestSortOrder}
                      propertyOptions={vacateRequestsProperties}
                    />
                    <div className="mt-8">
                      {/* Mobile Card Layout for Vacate Requests */}
                      <div className="block md:hidden space-y-4">
                        {currentVacateRequests.map((request) => (
                          <div
                            key={request.id}
                            onClick={() => {
                              setSelectedVacateRequest(request);
                              setIsVacateRequestModalOpen(true);
                            }}
                            className="bg-white bg-white rounded-lg shadow border border-gray-200 border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900 text-slate-900">
                                  {request.tenantName}
                                </h3>
                                <p className="text-xs text-gray-500 text-slate-500 mt-1">
                                  {request.property} - Unit {request.unit}
                                </p>
                              </div>
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                  request.status
                                )} flex-shrink-0`}
                              >
                                {request.status}
                              </span>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 text-slate-500">
                                  Request Date:
                                </span>
                                <span className="text-xs text-gray-900 text-slate-900">
                                  {request.requestDate}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 text-slate-500">
                                  Move-Out Date:
                                </span>
                                <span className="text-xs text-gray-900 text-slate-900">
                                  {request.moveOutDate}
                                </span>
                              </div>
                              <div className="flex items-start justify-between">
                                <span className="text-xs text-gray-500 text-slate-500">
                                  Reason:
                                </span>
                                <span className="text-xs text-gray-900 text-slate-900 text-right max-w-[60%]">
                                  {request.reason}
                                </span>
                              </div>
                            </div>
                            <div
                              className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200 border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {request.status === "Pending" && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVacateRequestAction(
                                        request.id,
                                        "approve"
                                      );
                                    }}
                                    className="text-[#0d9488] hover:text-[#0f766e] p-1"
                                    title="Approve"
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
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVacateRequestAction(
                                        request.id,
                                        "decline"
                                      );
                                    }}
                                    className="text-red-600 hover:text-red-900 p-1"
                                    title="Decline"
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNoticeToDelete({
                                    id: request.id,
                                    type: "vacate",
                                  });
                                  setIsDeleteConfirmModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table Layout for Vacate Requests */}
                      <div className="hidden md:block overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden shadow ring-1 ring-gray-200 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50 bg-white">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 text-slate-900 sm:pl-6"
                                  >
                                    Tenant Name
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Property
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Unit
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Request Date
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Move-Out Date
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Reason
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                  >
                                    <span className="sr-only">Actions</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {currentVacateRequests.map((request) => (
                                  <tr
                                    key={request.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => {
                                      setSelectedVacateRequest(request);
                                      setIsVacateRequestModalOpen(true);
                                    }}
                                  >
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 text-slate-900 sm:pl-6">
                                      {request.tenantName}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {request.property}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {request.unit}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {request.requestDate}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {request.moveOutDate}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {request.reason}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      <span
                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                          request.status
                                        )}`}
                                      >
                                        {request.status}
                                      </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                      <div
                                        className="flex items-center space-x-2"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {request.status === "Pending" && (
                                          <>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleVacateRequestAction(
                                                  request.id,
                                                  "approve"
                                                );
                                              }}
                                              className="text-[#0d9488] hover:text-[#0f766e]"
                                            >
                                              <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M5 13l4 4L19 7"
                                                />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleVacateRequestAction(
                                                  request.id,
                                                  "decline"
                                                );
                                              }}
                                              className="text-red-600 hover:text-red-900"
                                            >
                                              <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"
                                                />
                                              </svg>
                                            </button>
                                          </>
                                        )}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setNoticeToDelete({
                                              id: request.id,
                                              type: "vacate",
                                            });
                                            setIsDeleteConfirmModalOpen(true);
                                          }}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      {/* Pagination for vacate requests */}
                      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 border-gray-200 bg-white bg-white px-4 py-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-3">
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            <span className="text-xs text-gray-700 text-slate-700 whitespace-nowrap">
                              Page {vacateRequestsPage} of{" "}
                              {totalVacateRequestsPages}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-700 text-slate-700 hidden xs:inline">
                                Go to:
                              </span>
                              <input
                                type="number"
                                min="1"
                                max={totalVacateRequestsPages}
                                value={vacateRequestsPageInput}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setVacateRequestsPageInput(value);
                                  const page = parseInt(value);
                                  if (
                                    page >= 1 &&
                                    page <= totalVacateRequestsPages
                                  ) {
                                    handleVacateRequestsPageChange(page);
                                  }
                                }}
                                onBlur={() => {
                                  const page = parseInt(
                                    vacateRequestsPageInput
                                  );
                                  if (page < 1) {
                                    setVacateRequestsPageInput("1");
                                    handleVacateRequestsPageChange(1);
                                  } else if (page > totalVacateRequestsPages) {
                                    setVacateRequestsPageInput(
                                      totalVacateRequestsPages.toString()
                                    );
                                    handleVacateRequestsPageChange(
                                      totalVacateRequestsPages
                                    );
                                  }
                                }}
                                className="w-12 h-7 text-xs text-center rounded border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleVacateRequestsPageChange(
                                vacateRequestsPage - 1
                              )
                            }
                            disabled={vacateRequestsPage === 1}
                            className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            onClick={() =>
                              handleVacateRequestsPageChange(
                                vacateRequestsPage + 1
                              )
                            }
                            disabled={
                              vacateRequestsPage === totalVacateRequestsPages
                            }
                            className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                </>
              )}

              {noticeTab === "eviction" && (
                <>
                  <div className="mb-8">
                    <div className="sm:flex sm:items-center">
                      <div className="sm:flex-auto">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-lg font-semibold text-gray-900 text-slate-900">
                            Eviction Notices
                          </h2>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                          onClick={() => setIsNewEvictionNoticeModalOpen(true)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto"
                        >
                          <span>Send Eviction Notice</span>
                        </button>
                      </div>
                    </div>
                    <EvictionNoticeFilters
                      searchQuery={evictionNoticesSearch}
                      setSearchQuery={setEvictionNoticesSearch}
                      statusFilter={evictionNoticesStatusFilter}
                      setStatusFilter={setEvictionNoticesStatusFilter}
                      propertyFilter={evictionNoticesPropertyFilter}
                      setPropertyFilter={(value) =>
                        setEvictionNoticesPropertyFilter(value)
                      }
                      sortOrder={evictionNoticeSortOrder}
                      setSortOrder={setEvictionNoticeSortOrder}
                      propertyOptions={evictionNoticesProperties}
                    />
                    <div className="mt-8">
                      {/* Mobile Card Layout for Eviction Notices */}
                      <div className="block md:hidden space-y-4">
                        {currentEvictionNotices.map((notice) => (
                          <div
                            key={notice.id}
                            onClick={() => {
                              setSelectedEvictionNotice(notice);
                              setIsEvictionNoticeModalOpen(true);
                            }}
                            className="bg-white bg-white rounded-lg shadow border border-gray-200 border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow w-full"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900 text-slate-900">
                                  {notice.tenantName}
                                </h3>
                                <p className="text-xs text-gray-500 text-slate-500 mt-1">
                                  {notice.property} - Unit {notice.unit}
                                </p>
                              </div>
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                  notice.status
                                )} flex-shrink-0`}
                              >
                                {notice.status}
                              </span>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 text-slate-500">
                                  Date Sent:
                                </span>
                                <span className="text-xs text-gray-900 text-slate-900">
                                  {notice.dateSent}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 text-slate-500">
                                  Move-out Deadline:
                                </span>
                                <span className="text-xs text-gray-900 text-slate-900">
                                  {notice.moveOutDeadline}
                                </span>
                              </div>
                              <div className="flex items-start justify-between">
                                <span className="text-xs text-gray-500 text-slate-500">
                                  Reason:
                                </span>
                                <span className="text-xs text-gray-900 text-slate-900 text-right max-w-[60%]">
                                  {notice.reason}
                                </span>
                              </div>
                            </div>
                            <div
                              className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200 border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNoticeToEdit(notice);
                                  setIsEditModalOpen(true);
                                }}
                                className="text-[#0d9488] hover:text-[#0f766e] p-1"
                                title="Edit"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNoticeToDelete({
                                    id: notice.id,
                                    type: "eviction",
                                  });
                                  setIsDeleteConfirmModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table Layout for Eviction Notices */}
                      <div className="hidden md:block overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden shadow ring-1 ring-gray-200 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50 bg-white">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 text-slate-900 sm:pl-6"
                                  >
                                    Tenant
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Property
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Unit
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Date Sent
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Reason
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Move-out Deadline
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-slate-900"
                                  >
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {currentEvictionNotices.map((notice) => (
                                  <tr
                                    key={notice.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => {
                                      setSelectedEvictionNotice(notice);
                                      setIsEvictionNoticeModalOpen(true);
                                    }}
                                  >
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 text-slate-900 sm:pl-6">
                                      {notice.tenantName}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {notice.property}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {notice.unit}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {notice.dateSent}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {notice.reason}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      {notice.moveOutDeadline}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-slate-500">
                                      <span
                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                          notice.status
                                        )}`}
                                      >
                                        {notice.status}
                                      </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                      <div
                                        className="flex items-center space-x-2"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setNoticeToEdit(notice);
                                            setIsEditModalOpen(true);
                                          }}
                                          className="text-[#0d9488] hover:text-[#0f766e]"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setNoticeToDelete({
                                              id: notice.id,
                                              type: "eviction",
                                            });
                                            setIsDeleteConfirmModalOpen(true);
                                          }}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      {/* Pagination for eviction notices */}
                      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 border-gray-200 bg-white bg-white px-4 py-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-3">
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            <span className="text-xs text-gray-700 text-slate-700 whitespace-nowrap">
                              Page {evictionNoticesPage} of{" "}
                              {totalEvictionNoticesPages}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-700 text-slate-700 hidden xs:inline">
                                Go to:
                              </span>
                              <input
                                type="number"
                                min="1"
                                max={totalEvictionNoticesPages}
                                value={evictionNoticesPageInput}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setEvictionNoticesPageInput(value);
                                  const page = parseInt(value);
                                  if (
                                    page >= 1 &&
                                    page <= totalEvictionNoticesPages
                                  ) {
                                    handleEvictionNoticesPageChange(page);
                                  }
                                }}
                                onBlur={() => {
                                  const page = parseInt(
                                    evictionNoticesPageInput
                                  );
                                  if (page < 1) {
                                    setEvictionNoticesPageInput("1");
                                    handleEvictionNoticesPageChange(1);
                                  } else if (page > totalEvictionNoticesPages) {
                                    setEvictionNoticesPageInput(
                                      totalEvictionNoticesPages.toString()
                                    );
                                    handleEvictionNoticesPageChange(
                                      totalEvictionNoticesPages
                                    );
                                  }
                                }}
                                className="w-12 h-7 text-xs text-center rounded border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleEvictionNoticesPageChange(
                                evictionNoticesPage - 1
                              )
                            }
                            disabled={evictionNoticesPage === 1}
                            className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            onClick={() =>
                              handleEvictionNoticesPageChange(
                                evictionNoticesPage + 1
                              )
                            }
                            disabled={
                              evictionNoticesPage === totalEvictionNoticesPages
                            }
                            className="inline-flex items-center p-2 sm:p-1.5 text-xs font-medium rounded-md border border-gray-300 border-gray-300 bg-white bg-slate-50 text-gray-700 text-slate-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isVacateRequestModalOpen}
        onClose={() => setIsVacateRequestModalOpen(false)}
      >
        {selectedVacateRequest && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 text-slate-900">
              Vacate Request Details
            </h3>
            <div className="mt-2 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Tenant Name
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedVacateRequest.tenantName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Property
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedVacateRequest.property}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Request Date
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedVacateRequest.requestDate}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Move-Out Date
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedVacateRequest.moveOutDate}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Reason
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedVacateRequest.reason}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
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
              {selectedVacateRequest.status === "Declined" &&
                selectedVacateRequest.declineReason && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                      Decline Reason
                    </h4>
                    <p className="mt-1 text-sm text-gray-900 text-slate-900">
                      {selectedVacateRequest.declineReason}
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}
      </Modal>

      {/* Notice Detail Modal */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
      >
        {getNoticeDetailContent()}
      </Modal>

      {/* New Eviction Notice Modal */}
      <Modal
        isOpen={isNewEvictionNoticeModalOpen}
        onClose={() => setIsNewEvictionNoticeModalOpen(false)}
      >
        <div className="space-y-4 w-full">
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-slate-900">
            New Eviction Notice
          </h3>
          <div className="mt-2 space-y-4 w-full">
            <EvictionNoticeForm
              tenants={mockTenants}
              onSubmit={(formData) => {
                const newNotice = {
                  id: evictionNotices.length + 1,
                  ...formData,
                  dateSent: new Date().toISOString().split("T")[0],
                  status: "Pending",
                };
                setEvictionNotices([newNotice, ...evictionNotices]);
                setIsNewEvictionNoticeModalOpen(false);
              }}
              onCancel={() => setIsNewEvictionNoticeModalOpen(false)}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setNoticeToEdit(null);
        }}
      >
        {getEditModalContent()}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => {
          setIsDeleteConfirmModalOpen(false);
          setNoticeToDelete(null);
        }}
      >
        {getDeleteModalContent()}
      </Modal>

      {/* Add Create Notice Modal */}
      <Modal
        isOpen={isCreateNoticeModalOpen}
        onClose={() => {
          setIsCreateNoticeModalOpen(false);
          setCreateNoticeError(null);
        }}
      >
        <div className="space-y-4 w-full">
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-slate-900">
            Create Notice
          </h3>
          {createNoticeError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-center">
              {createNoticeError}
            </div>
          )}
          <div className="mt-2 space-y-4 w-full">
            <CreateNoticeForm
              onSubmit={handleCreateNotice}
              onClose={() => setIsCreateNoticeModalOpen(false)}
              hideContainer={true}
            />
          </div>
        </div>
      </Modal>

      {/* Eviction Notice Detail Modal */}
      <Modal
        isOpen={isEvictionNoticeModalOpen}
        onClose={() => setIsEvictionNoticeModalOpen(false)}
      >
        {selectedEvictionNotice && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 text-slate-900">
              Eviction Notice Details
            </h3>
            <div className="mt-2 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Tenant Name
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedEvictionNotice.tenantName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Property
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedEvictionNotice.property}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Unit
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedEvictionNotice.unit}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Date Sent
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedEvictionNotice.dateSent}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Reason
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedEvictionNotice.reason}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Move Out Deadline
                </h4>
                <p className="mt-1 text-sm text-gray-900 text-slate-900">
                  {selectedEvictionNotice.moveOutDeadline}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 text-slate-500">
                  Status
                </h4>
                <p className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                      selectedEvictionNotice.status
                    )}`}
                  >
                    {selectedEvictionNotice.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Decline Reason Modal */}
      <Modal
        isOpen={isDeclineReasonModalOpen}
        onClose={() => {
          setIsDeclineReasonModalOpen(false);
          setDeclineReason("");
          setRequestToDecline(null);
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-slate-900">
            Decline Vacate Request
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 text-slate-500">
              Please provide a reason for declining this vacate request.
            </p>
          </div>
          <div className="mt-4">
            <label
              htmlFor="decline-reason"
              className="block text-sm font-medium text-gray-700 text-slate-600"
            >
              Reason
            </label>
            <textarea
              id="decline-reason"
              rows={4}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-slate-50 text-slate-900 caret-slate-900 sm:text-sm"
              placeholder="Enter your reason for declining..."
              required
            />
          </div>
          <div className="mt-5 sm:mt-6 flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsDeclineReasonModalOpen(false);
                setDeclineReason("");
                setRequestToDecline(null);
              }}
              className="inline-flex justify-center w-full rounded-md border border-gray-300 border-gray-300 shadow-sm px-4 py-2 bg-white bg-slate-50 text-base font-medium text-gray-700 text-slate-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                handleVacateRequestAction(requestToDecline, "decline")
              }
              disabled={!declineReason.trim()}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#0d9488] text-base font-medium text-white hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notices;
