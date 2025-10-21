import { apiRequest } from "./api";

// API endpoints
const MAINTENANCE_ENDPOINTS = {
  TENANT_REQUESTS: "/tenant/maintenance/",
  CREATE_TENANT_REQUEST: "/tenant/maintenance/create/",
  LANDLORD_REQUESTS: "/landlord/maintenance/",
  MAINTENANCE_DETAIL: "/landlord-maintenance/",
  MAINTENANCE_MESSAGES: "/maintenance-messages/",
};

// Status colors for UI
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Priority colors for UI
export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "emergency":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format date and time for display
export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// API Functions

// Get tenant maintenance requests
export const getTenantMaintenanceRequests = async () => {
  try {
    const response = await apiRequest(MAINTENANCE_ENDPOINTS.TENANT_REQUESTS);
    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching tenant maintenance requests:", error);
    // Provide a more user-friendly error message for tenant profile issues
    if (
      error.message &&
      error.message.toLowerCase().includes("tenant profile not found")
    ) {
      return { success: false, error: "tenant profile not found" };
    }
    return {
      success: false,
      error: error.message || "Failed to fetch maintenance requests",
    };
  }
};

// Create new maintenance request (tenant)
export const createMaintenanceRequest = async (requestData) => {
  try {
    const formData = new FormData();

    // Add text fields
    Object.keys(requestData).forEach((key) => {
      if (key === "images" && requestData[key]) {
        // Handle multiple images
        requestData[key].forEach((image, index) => {
          formData.append("image", image);
        });
      } else if (key !== "images") {
        formData.append(key, requestData[key]);
      }
    });

    const response = await apiRequest(
      MAINTENANCE_ENDPOINTS.CREATE_TENANT_REQUEST,
      {
        method: "POST",
        body: formData,
      }
    );
    return { success: true, data: response };
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    return { success: false, error: error.message };
  }
};

// Get landlord maintenance requests
export const getLandlordMaintenanceRequests = async () => {
  try {
    const response = await apiRequest(MAINTENANCE_ENDPOINTS.LANDLORD_REQUESTS);
    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching landlord maintenance requests:", error);
    return { success: false, error: error.message };
  }
};

// Get maintenance request detail
export const getMaintenanceRequestDetail = async (requestId) => {
  try {
    const response = await apiRequest(
      `${MAINTENANCE_ENDPOINTS.MAINTENANCE_DETAIL}${requestId}/`
    );
    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching maintenance request detail:", error);
    return { success: false, error: error.message };
  }
};

// Update maintenance request
export const updateMaintenanceRequest = async (requestId, updateData) => {
  try {
    console.log(
      "API: Updating maintenance request",
      requestId,
      "with data:",
      updateData
    );

    const url = `${MAINTENANCE_ENDPOINTS.MAINTENANCE_DETAIL}${requestId}/`;
    console.log("API: Full URL:", url);

    const response = await apiRequest(url, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });

    console.log("API: Update response:", response);
    return { success: true, data: response };
  } catch (error) {
    console.error("Error updating maintenance request:", error);
    return { success: false, error: error.message };
  }
};

// Delete maintenance request
export const deleteMaintenanceRequest = async (requestId) => {
  try {
    await apiRequest(
      `${MAINTENANCE_ENDPOINTS.MAINTENANCE_DETAIL}${requestId}/`,
      {
        method: "DELETE",
      }
    );
    return { success: true };
  } catch (error) {
    console.error("Error deleting maintenance request:", error);
    return { success: false, error: error.message };
  }
};

// Get maintenance messages
export const getMaintenanceMessages = async (requestId) => {
  try {
    const response = await apiRequest(
      `${MAINTENANCE_ENDPOINTS.MAINTENANCE_MESSAGES}?maintenance=${requestId}`
    );
    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching maintenance messages:", error);
    return { success: false, error: error.message };
  }
};

// Send maintenance message
export const sendMaintenanceMessage = async (requestId, message) => {
  try {
    const response = await apiRequest(
      MAINTENANCE_ENDPOINTS.MAINTENANCE_MESSAGES,
      {
        method: "POST",
        body: JSON.stringify({
          maintenance: requestId,
          message: message,
        }),
      }
    );
    return { success: true, data: response };
  } catch (error) {
    console.error("Error sending maintenance message:", error);
    return { success: false, error: error.message };
  }
};

// Filter and sort functions
export const filterMaintenanceRequests = (requests, filters) => {
  let filtered = [...requests];

  // Status filter
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter(
      (request) => request.status.toLowerCase() === filters.status.toLowerCase()
    );
  }

  // Priority filter
  if (filters.priority && filters.priority !== "all") {
    filtered = filtered.filter(
      (request) =>
        request.priority.toLowerCase() === filters.priority.toLowerCase()
    );
  }

  // Property filter
  if (filters.property && filters.property !== "all") {
    filtered = filtered.filter(
      (request) => request.property === parseInt(filters.property)
    );
  }

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(
      (request) =>
        request.subject.toLowerCase().includes(searchTerm) ||
        request.description.toLowerCase().includes(searchTerm) ||
        (request.tenant_name &&
          request.tenant_name.toLowerCase().includes(searchTerm))
    );
  }

  return filtered;
};

export const sortMaintenanceRequests = (requests, sortBy = "latest") => {
  const sorted = [...requests];

  switch (sortBy) {
    case "latest":
      return sorted.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    case "priority":
      const priorityOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
      return sorted.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    case "status":
      const statusOrder = {
        pending: 1,
        in_progress: 2,
        completed: 3,
        cancelled: 4,
      };
      return sorted.sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
      );
    default:
      return sorted;
  }
};

// Validation functions
export const validateMaintenanceRequest = (data) => {
  const errors = {};

  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = "Subject must be at least 3 characters long";
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters long";
  }

  if (!data.priority) {
    errors.priority = "Priority is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
