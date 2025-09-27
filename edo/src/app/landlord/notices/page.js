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

  // React Query for fetching notices
  const {
    data: notices = [],
    isLoading: loadingNotices,
    error: noticesQueryError,
  } = useQuery({
    queryKey: ["notices"],
    queryFn: () => apiRequest("/notices/", { method: "GET" }),
    enabled: isAuthenticated(),
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

  // Handle error state from React Query
  const noticesError = noticesQueryError ? "Could not load notices." : null;

  if (!isAuthenticated()) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#F5F5DC] dark:bg-slate-900">
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-50 dark:bg-slate-900">
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

  // Initialize vacate requests state
  const [vacateRequests, setVacateRequests] = useState([
    {
      id: 1,
      tenantName: "Jane Doe",
      property: "Sunset Apartments",
      unit: "A101",
      requestDate: "2024-03-01",
      moveOutDate: "2024-04-01",
      reason: "Job relocation to another city",
      status: "Pending",
    },
    {
      id: 2,
      tenantName: "John Smith",
      property: "Mountain View Condos",
      unit: "B202",
      requestDate: "2024-03-03",
      moveOutDate: "2024-03-30",
      reason: "Moving in with family",
      status: "Approved",
    },
    {
      id: 3,
      tenantName: "Sarah Johnson",
      property: "Riverside Townhomes",
      unit: "C303",
      requestDate: "2024-03-05",
      moveOutDate: "2024-04-05",
      reason: "Found a larger apartment",
      status: "Declined",
    },
  ]);

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
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    switch (type.toLowerCase()) {
      case "rent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "payment":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "lease":
        return "bg-[#0d9488]/10 text-[#0d9488] dark:bg-[#0d9488]/20 dark:text-[#0d9488]";
      case "utility":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "general":
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status) => {
    if (!status)
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";

    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "acknowledged":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
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

    setVacateRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === requestId) {
          return {
            ...request,
            status: action === "approve" ? "Approved" : "Declined",
            declineReason: action === "decline" ? declineReason : null,
          };
        }
        return request;
      })
    );

    // Update selected request if it's the one being modified
    if (selectedVacateRequest && selectedVacateRequest.id === requestId) {
      setSelectedVacateRequest((prev) => ({
        ...prev,
        status: action === "approve" ? "Approved" : "Declined",
        declineReason: action === "decline" ? declineReason : null,
      }));
    }

    // Close the modal after action
    setIsVacateRequestModalOpen(false);
    setIsDeclineReasonModalOpen(false);
    setDeclineReason("");
    setRequestToDecline(null);
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
            className="fixed inset-0 bg-gray-900/30 dark:bg-gray-900/50 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-[95%] sm:w-full sm:max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
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
      setVacateRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== noticeToDelete.id)
      );
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
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-300"
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
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            Delete{" "}
            {isGeneralNotice
              ? "Notice"
              : isVacateRequest
              ? "Vacate Request"
              : "Eviction Notice"}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
            className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:text-sm"
            onClick={() => setIsDeleteConfirmModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
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
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
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
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-property"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-unit"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-reason"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-moveOutDeadline"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status
              </label>
              <select
                id="edit-status"
                value={noticeToEdit.status}
                onChange={(e) =>
                  setNoticeToEdit({ ...noticeToEdit, status: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Acknowledged">Acknowledged</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setNoticeToEdit(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {selectedNotice.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedNotice.effective_date ||
                selectedNotice.date_sent ||
                selectedNotice.date ||
                ""}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Unit
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {selectedNotice.unit
                ? selectedNotice.unit.unit_number || selectedNotice.unit
                : "All"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Audience
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {selectedNotice.tenant
                ? (selectedNotice.tenant.first_name || "") +
                  " " +
                  (selectedNotice.tenant.last_name || "")
                : "All"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Message
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {selectedNotice.message || ""}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => setIsNoticeModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
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
    <div className="flex h-screen overflow-hidden bg-[#F5F5DC] dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        {/* Site header */}
        <Header toggleSidebar={toggleSidebar} />

        <main className="grow">
          <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-8 w-full">
            {/* Page header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Notices
              </h1>
            </div>

            {/* Notices Section */}
            <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
              <nav className="-mb-px flex min-w-0 w-full">
                <button
                  onClick={() => setNoticeTab("general")}
                  className={`flex-1 min-w-0 whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-150 ${
                    noticeTab === "general"
                      ? "border-teal-500 text-teal-600 dark:text-teal-400"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                  style={{ borderBottomWidth: noticeTab === "general" ? 3 : 2 }}
                >
                  General Notices
                </button>
                <button
                  onClick={() => setNoticeTab("vacate")}
                  className={`flex-1 min-w-0 whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-150 ${
                    noticeTab === "vacate"
                      ? "border-teal-500 text-teal-600 dark:text-teal-400"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                  style={{ borderBottomWidth: noticeTab === "vacate" ? 3 : 2 }}
                >
                  Vacate Requests
                </button>
                <button
                  onClick={() => setNoticeTab("eviction")}
                  className={`flex-1 min-w-0 whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-150 ${
                    noticeTab === "eviction"
                      ? "border-teal-500 text-teal-600 dark:text-teal-400"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                  style={{
                    borderBottomWidth: noticeTab === "eviction" ? 3 : 2,
                  }}
                >
                  Eviction Notices
                </button>
              </nav>
            </div>

            {/* Conditionally render the content for each tab based on noticeTab */}
            {noticeTab === "general" && (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setIsCreateNoticeModalOpen(true)}
                      className="btn bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200 z-10 relative"
                    >
                      <span>Create Notice</span>
                    </button>
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
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-12 text-lg">
                    Loading notices...
                  </div>
                ) : noticesError ? (
                  <div className="text-center text-red-500 mt-12 text-lg">
                    {noticesError}
                  </div>
                ) : currentNotices.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-12 text-lg">
                    No notices found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                              >
                                Title
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                              >
                                Type
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
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                              >
                                Audience
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {currentNotices.map((notice) => (
                              <tr
                                key={notice.id}
                                onClick={() => handleNoticeClick(notice)}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                              >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                                  {notice.title}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
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
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  {notice.unit
                                    ? notice.unit.unit_number || notice.unit
                                    : "All"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  {notice.effective_date ||
                                    notice.date_sent ||
                                    notice.date ||
                                    ""}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
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
                                      className="text-[#0d9488] hover:text-[#0f766e] dark:text-[#0d9488] dark:hover:text-[#0f766e]"
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
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
                )}
                {/* Pagination for notices */}
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
              </>
            )}

            {noticeTab === "vacate" && (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4"></div>
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
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                                >
                                  Tenant Name
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
                                  Request Date
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                                >
                                  Move-Out Date
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                                >
                                  Reason
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
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
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                              {currentVacateRequests.map((request) => (
                                <tr
                                  key={request.id}
                                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                  onClick={() => {
                                    setSelectedVacateRequest(request);
                                    setIsVacateRequestModalOpen(true);
                                  }}
                                >
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                                    {request.tenantName}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {request.property}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {request.requestDate}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {request.moveOutDate}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {request.reason}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
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
                                            className="text-[#0d9488] hover:text-[#0f766e] dark:text-[#0d9488] dark:hover:text-[#0f766e]"
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
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-700 dark:text-gray-200">
                            Page {vacateRequestsPage} of{" "}
                            {totalVacateRequestsPages}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-700 dark:text-gray-200">
                              Go to page:
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
                                const page = parseInt(vacateRequestsPageInput);
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
                              className="w-12 h-6 text-xs text-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
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
                            onClick={() =>
                              handleVacateRequestsPageChange(
                                vacateRequestsPage + 1
                              )
                            }
                            disabled={
                              vacateRequestsPage === totalVacateRequestsPages
                            }
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
              </>
            )}

            {noticeTab === "eviction" && (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setIsNewEvictionNoticeModalOpen(true)}
                      className="btn bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200 z-10 relative"
                    >
                      <span>Send Eviction Notice</span>
                    </button>
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
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                  Date Sent
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                                >
                                  Reason
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                                >
                                  Move-out Deadline
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
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                              {currentEvictionNotices.map((notice) => (
                                <tr
                                  key={notice.id}
                                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                  onClick={() => {
                                    setSelectedEvictionNotice(notice);
                                    setIsEvictionNoticeModalOpen(true);
                                  }}
                                >
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                                    {notice.tenantName}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {notice.property}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {notice.unit}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {notice.dateSent}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {notice.reason}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {notice.moveOutDeadline}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
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
                                        className="text-[#0d9488] hover:text-[#0f766e] dark:text-[#0d9488] dark:hover:text-[#0f766e]"
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
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
                    {/* Pagination for notices */}
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
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isVacateRequestModalOpen}
        onClose={() => setIsVacateRequestModalOpen(false)}
      >
        {selectedVacateRequest && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
              Vacate Request Details
            </h3>
            <div className="mt-2 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tenant Name
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedVacateRequest.tenantName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Property
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedVacateRequest.property}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Request Date
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedVacateRequest.requestDate}
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
              {selectedVacateRequest.status === "Declined" &&
                selectedVacateRequest.declineReason && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Decline Reason
                    </h4>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
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
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
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
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
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
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
              Eviction Notice Details
            </h3>
            <div className="mt-2 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tenant Name
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedEvictionNotice.tenantName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Property
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedEvictionNotice.property}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Unit
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedEvictionNotice.unit}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date Sent
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedEvictionNotice.dateSent}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Reason
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedEvictionNotice.reason}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Move Out Deadline
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedEvictionNotice.moveOutDeadline}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            Decline Vacate Request
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please provide a reason for declining this vacate request.
            </p>
          </div>
          <div className="mt-4">
            <label
              htmlFor="decline-reason"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reason
            </label>
            <textarea
              id="decline-reason"
              rows={4}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
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
              className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] sm:text-sm"
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
