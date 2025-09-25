const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// Simple auth status cache to reduce repeated checks
let authCache = {
  isAuthenticated: false,
  lastChecked: 0,
  cacheTimeout: 5000, // 5 seconds
};

// Clear auth cache when token changes
const clearAuthCache = () => {
  authCache.lastChecked = 0;
};

// Token management
const getToken = () => {
  // Only access localStorage in browser environment
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

const setToken = (token) => {
  // Only access localStorage in browser environment
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
    clearAuthCache(); // Clear cache when token changes
  }
};

const removeToken = () => {
  // Only access localStorage in browser environment
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    clearAuthCache(); // Clear cache when token is removed
  }
};

const getRefreshToken = () => {
  // Only access localStorage in browser environment
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
};

const setRefreshToken = (token) => {
  // Only access localStorage in browser environment
  if (typeof window !== "undefined") {
    localStorage.setItem("refresh_token", token);
  }
};

const removeRefreshToken = () => {
  // Only access localStorage in browser environment
  if (typeof window !== "undefined") {
    localStorage.removeItem("refresh_token");
  }
};

// Refresh access token using refresh token
const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token available");
  const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }
  const data = await response.json();
  if (data.access) {
    setToken(data.access);
    return data.access;
  } else {
    throw new Error("No access token in refresh response");
  }
};

// API request helper with timeout
const apiRequest = async (endpoint, options = {}, retry = true) => {
  const token = getToken();

  // Debug: Log the token being used
  console.debug("API Request Token:", token);

  // Don't send token for authentication endpoints
  const isAuthEndpoint =
    endpoint.includes("/auth/login/") ||
    endpoint.includes("/auth/register/") ||
    endpoint.includes("/token/refresh/");

  // Start with any headers passed in options
  let headers = { ...options.headers };

  // Always set Authorization if token is present and not an auth endpoint
  if (token && !isAuthEndpoint) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  const config = {
    ...options,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    clearTimeout(timeoutId); // Clear timeout on successful response

    let data;
    const text = await response.text();

    // Check if response is empty
    if (!text) {
      data = { message: "Empty response from server" };
    } else {
      try {
        data = JSON.parse(text);
      } catch (e) {
        // If parsing fails, return the raw text with appropriate message
        data = {
          message: "Server returned non-JSON response",
          raw: text,
          status: response.status,
        };
      }
    }

    if (!response.ok) {
      // If 401 and token error, try refresh
      if (
        response.status === 401 &&
        retry &&
        (data.detail === "Given token not valid for any token type" ||
          data.code === "token_not_valid")
      ) {
        try {
          await refreshToken();
          // Retry original request once with new token
          return await apiRequest(endpoint, options, false);
        } catch (refreshError) {
          // Refresh failed, log out user
          authAPI.logout();
          window.location.href = "/auth/signin";
          throw new Error("Session expired. Please log in again.");
        }
      }
      // Attach the full backend error response to the thrown error
      const error = new Error(
        data.message ||
          data.detail ||
          data.error ||
          `HTTP ${response.status}: Something went wrong`
      );
      error.response = data;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId); // Clear timeout on error

    // Handle timeout specifically
    if (error.name === "AbortError") {
      console.error("Request timeout after 30 seconds for endpoint:", endpoint);
      throw new Error(
        "Request timeout. Please check your connection and try again."
      );
    }

    // Enhanced error handling for network issues
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error(
        "Network Error: Could not connect to backend server at",
        API_BASE_URL
      );
      console.error(
        "Please check if your backend server is running and accessible"
      );
      throw new Error(
        `Could not connect to server at ${API_BASE_URL}. Please ensure the backend is running.`
      );
    }

    // Re-throw the error if it's already properly formatted
    if (error.status) {
      throw error;
    }

    // Show backend error message if available
    console.error("API Error:", error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await apiRequest("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.tokens) {
      setToken(response.tokens.access);
      // Only access localStorage in browser environment
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.tokens.refresh);
      }
    }

    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.tokens) {
      setToken(response.tokens.access);
      // Only access localStorage in browser environment
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.tokens.refresh);
      }
    }

    return response;
  },

  // Logout user
  logout: () => {
    removeToken();
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiRequest("/users/me/");
  },

  // Add a role to the current user (onboarding)
  addRoleToCurrentUser: async (role) => {
    return await apiRequest("/onboard-role/", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
  },
};

// User API
export const userAPI = {
  // Get all users
  getUsers: async () => {
    return await apiRequest("/users/");
  },

  // Get user by ID
  getUser: async (id) => {
    return await apiRequest(`/users/${id}/`);
  },

  // Update user
  updateUser: async (id, userData) => {
    let options = { method: "PATCH" };
    if (userData instanceof FormData) {
      options.body = userData;
      options.headers = { ...options.headers }; // Do not set Content-Type, browser will set it
    } else {
      options.body = JSON.stringify(userData);
      options.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };
    }
    return await apiRequest(`/users/${id}/`, options);
  },

  // Relinquish a role
  relinquishRole: async (role) => {
    return await apiRequest("/relinquish-role/", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
  },
};

// Check if user is authenticated with caching
export const isAuthenticated = () => {
  const now = Date.now();

  // Return cached result if still valid
  if (now - authCache.lastChecked < authCache.cacheTimeout) {
    return authCache.isAuthenticated;
  }

  // Update cache
  const token = getToken();
  authCache.isAuthenticated = !!token && typeof window !== "undefined";
  authCache.lastChecked = now;

  return authCache.isAuthenticated;
};

// Get stored user data
export const getStoredUser = () => {
  // Only access localStorage in browser environment
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Store user data
export const storeUser = (user) => {
  // Only access localStorage in browser environment
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const landlordPropertyAPI = {
  // Fetch all properties for the logged-in landlord
  list: async () => {
    return await apiRequest("/landlord/properties/", { method: "GET" });
  },
  // Add a new property for the landlord
  create: async (propertyData) => {
    return await apiRequest("/landlord/properties/", {
      method: "POST",
      body: JSON.stringify(propertyData),
    });
  },
  // Update a property for the landlord
  update: async (id, propertyData) => {
    return await apiRequest(`/landlord/properties/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(propertyData),
    });
  },
  // Delete a property for the landlord
  delete: async (id) => {
    return await apiRequest(`/landlord/properties/${id}/`, {
      method: "DELETE",
    });
  },
  // Create a unit for a property
  createUnit: async (unitData) => {
    return await apiRequest("/units/", {
      method: "POST",
      body: JSON.stringify(unitData),
    });
  },
  // Update a unit
  updateUnit: async (unit, unitData, method = "PUT") => {
    // Accept either a unit object or id
    const unitId = typeof unit === "object" ? unit.id : unit;
    return await apiRequest(`/units/${unitId}/`, {
      method,
      body: JSON.stringify(unitData),
    });
  },
  // Delete a unit
  deleteUnit: async (unit) => {
    // Accept either a unit object or id
    const unitId = typeof unit === "object" ? unit.id : unit;
    return await apiRequest(`/units/${unitId}/`, {
      method: "DELETE",
    });
  },
};

export const tenantAPI = {
  // Fetch all rental properties for the logged-in tenant
  getRentals: async () => {
    return await apiRequest("/tenant/rentals/", { method: "GET" });
  },
  // Check if a user exists by email
  checkUserByEmail: async (email) => {
    return await apiRequest(
      `/users/check-email/?email=${encodeURIComponent(email)}`,
      { method: "GET" }
    );
  },
};

// Landlord tenant management API
export const landlordTenantAPI = {
  // Fetch all tenants for the logged-in landlord
  list: async () => {
    return await apiRequest("/tenants/", { method: "GET" });
  },
  // Add a new tenant
  create: async (tenantData) => {
    return await apiRequest("/tenants/", {
      method: "POST",
      body: JSON.stringify(tenantData),
    });
  },
  // Update a tenant
  update: async (id, tenantData) => {
    return await apiRequest(`/tenants/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(tenantData),
    });
  },
  // Delete a tenant
  delete: async (id) => {
    return await apiRequest(`/tenants/${id}/`, {
      method: "DELETE",
    });
  },
};

// Test API connectivity
export const testApiConnectivity = async () => {
  try {
    // Try a simple fetch with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(API_BASE_URL, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return {
      success: true,
      message: `API is accessible. Status: ${response.status} ${response.statusText}`,
      status: response.status,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    let message = "";
    if (error.name === "AbortError") {
      message =
        "Request timed out - server may not be responding or may be taking too long to respond";
    } else if (error.message.includes("ECONNREFUSED")) {
      message =
        "Connection refused - backend server is not running or not accessible on the specified port";
    } else if (error.message.includes("Failed to fetch")) {
      message =
        "Failed to fetch - unable to establish connection to the backend server";
    } else {
      message = `Connection failed: ${error.message}`;
    }

    return {
      success: false,
      message: message,
    };
  }
};

export const becomeLandlord = async () => {
  return await apiRequest("/users/become_landlord/", { method: "POST" });
};

// Hidden for phased launch - available for development only
// export const becomeHost = async () => {
//   return await apiRequest("/users/become_host/", { method: "POST" });
// };

export const becomeTenant = async () => {
  return await apiRequest("/users/become_tenant/", { method: "POST" });
};

// Chat message API
export const chatAPI = {
  // Get chat messages
  getMessages: async () => {
    return await apiRequest("/chat-messages/", { method: "GET" });
  },
  // Send a chat message
  sendMessage: async (messageData) => {
    return await apiRequest("/chat-messages/", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  },
};

export { getToken };
export { apiRequest };
