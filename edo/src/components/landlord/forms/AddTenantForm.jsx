import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, tenantAPI } from "../../../utils/api";

const AddTenantForm = ({
  onClose,
  onSubmit,
  initialPropertyId,
  initialUnitNumber,
  initialUnitId, // Add this to handle specific unit selection
}) => {
  const [activeTab, setActiveTab] = useState("quick-add"); // 'quick-add' or 'invite'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyId: initialPropertyId || "",
    unitNumber: initialUnitNumber || "",
    rentAmount: "",
    securityDeposit: "",
    leaseType: "rental",
    startDate: new Date().toISOString().split("T")[0], // Default to today's date
    endDate: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });
  const [inviteData, setInviteData] = useState({
    email: "",
    phone: "",
    propertyId: initialPropertyId || "",
    unitNumber: initialUnitNumber || "",
    message: "",
  });
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userFound, setUserFound] = useState(false);
  const [checking, setChecking] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingEmail, setSearchingEmail] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const queryClient = useQueryClient();

  // React Query for fetching properties
  const { data: properties = [] } = useQuery({
    queryKey: ["landlord-properties"],
    queryFn: () => apiRequest("/landlord/properties/", { method: "GET" }),
  });

  // React Query for fetching units based on propertyId
  const propertyId =
    activeTab === "quick-add" ? formData.propertyId : inviteData.propertyId;

  const { data: units = [], isLoading: loadingUnits } = useQuery({
    queryKey: ["property-units", propertyId],
    queryFn: () =>
      apiRequest(`/landlord/properties/${propertyId}/units/`, {
        method: "GET",
      }),
    enabled: !!propertyId,
  });

  // React Query mutation for email search
  const emailSearchMutation = useMutation({
    mutationFn: (query) =>
      apiRequest(`/users/search-email/?q=${encodeURIComponent(query)}`, {
        method: "GET",
      }),
    onSuccess: (response) => {
      setEmailSuggestions(response.suggestions || []);
      setShowSuggestions(
        response.suggestions && response.suggestions.length > 0
      );
    },
    onError: () => {
      setEmailSuggestions([]);
      setShowSuggestions(false);
    },
  });

  // React Query mutation for checking user by email
  const checkUserMutation = useMutation({
    mutationFn: (email) => tenantAPI.checkUserByEmail(email),
    onSuccess: (res) => {
      if (res.exists) {
        // Check if the user is already registered as a tenant
        if (res.is_tenant) {
          setError(
            "This email is already registered as a tenant. Please use a different email or manage the existing tenant."
          );
          setUserFound(false);
        } else {
          // User exists but is not yet a tenant, populate the form
          setFormData((prev) => ({
            ...prev,
            firstName: res.user.first_name || "",
            lastName: res.user.last_name || "",
            phone: res.user.phone || "",
          }));
          setUserFound(true);
          setError(""); // Clear any previous errors
        }
      } else {
        // User doesn't exist, they need to fill in their details
        setUserFound(false);
        setError(""); // Clear any previous errors
      }
      setEmailChecked(true);
    },
    onError: () => {
      setError("Error checking email. Please try again.");
    },
  });

  // Update form data when property changes
  useEffect(() => {
    if (!propertyId) {
      setSelectedUnit(null);
      if (activeTab === "quick-add") {
        setFormData((prev) => ({
          ...prev,
          rentAmount: "",
          securityDeposit: "",
        }));
      }
      return;
    }

    // If we have a specific unit ID, don't clear the unit selection
    if (!initialUnitId) {
      // Clear selected unit when property changes
      setSelectedUnit(null);
      if (activeTab === "quick-add") {
        setFormData((prev) => ({
          ...prev,
          unitNumber: "",
          rentAmount: "",
          securityDeposit: "",
        }));
      } else {
        setInviteData((prev) => ({
          ...prev,
          unitNumber: "",
        }));
      }
    }
  }, [propertyId, activeTab, initialUnitId]);

  // Update formData if initialPropertyId, initialUnitNumber, or initialUnitId change
  useEffect(() => {
    // Only update if values have actually changed to prevent infinite loops
    if (
      initialPropertyId !== formData.propertyId ||
      initialUnitNumber !== formData.unitNumber
    ) {
      setFormData((prev) => ({
        ...prev,
        propertyId: initialPropertyId || "",
        unitNumber: initialUnitNumber || "",
      }));
    }

    if (
      initialPropertyId !== inviteData.propertyId ||
      initialUnitNumber !== inviteData.unitNumber
    ) {
      setInviteData((prev) => ({
        ...prev,
        propertyId: initialPropertyId || "",
        unitNumber: initialUnitNumber || "",
      }));
    }

    // If we have a specific unit ID, find and populate unit details
    if (initialUnitId && units.length > 0) {
      const specificUnit = units.find((unit) => unit.id === initialUnitId);
      if (
        specificUnit &&
        (!selectedUnit || selectedUnit.id !== specificUnit.id)
      ) {
        setFormData((prev) => ({
          ...prev,
          rentAmount: specificUnit.rent_amount || "",
          securityDeposit: specificUnit.security_deposit || "",
        }));
        setSelectedUnit(specificUnit);
      }
    }
  }, [initialPropertyId, initialUnitNumber, initialUnitId, units.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields before sending request
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.unitNumber ||
      !formData.startDate
    ) {
      setError("All required fields must be filled out.");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Validate date format
    if (isNaN(Date.parse(formData.startDate))) {
      setError("Please enter a valid start date.");
      setLoading(false);
      return;
    }

    if (formData.endDate && isNaN(Date.parse(formData.endDate))) {
      setError("Please enter a valid end date.");
      setLoading(false);
      return;
    }

    // Prevent submission if email is already registered as a tenant
    if (
      emailChecked &&
      userFound &&
      error.includes("already registered as a tenant")
    ) {
      setError(
        "Cannot add tenant: This email is already registered as a tenant."
      );
      setLoading(false);
      return;
    }

    try {
      if (activeTab === "invite") {
        // Handle invitation
        const response = await apiRequest("/tenants/invite/", {
          method: "POST",
          body: JSON.stringify({
            email: inviteData.email,
            phone: inviteData.phone,
            property_id: inviteData.propertyId,
            unit_number: inviteData.unitNumber,
            message: inviteData.message,
          }),
        });
        // Refresh tenants list to show the new invitation
        queryClient.invalidateQueries({ queryKey: ["tenants"] });
      } else {
        // Handle quick add - transform data for backend
        const tenantData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          unit_id: formData.unitNumber,
          lease_type: formData.leaseType,
          start_date: formData.startDate,
          end_date: formData.endDate || null,
          emergency_contact_name: formData.emergencyContact.name || "",
          emergency_contact_phone: formData.emergencyContact.phone || "",
          emergency_contact_relationship:
            formData.emergencyContact.relationship || "",
        };

        const response = await apiRequest("/tenants/", {
          method: "POST",
          body: JSON.stringify(tenantData),
        });
        queryClient.invalidateQueries({ queryKey: ["tenants"] });
      }
      onSubmit();
    } catch (err) {
      console.error("Error submitting form:", err);
      let errorMessage = "Failed to add tenant. Please try again.";
      if (err.response) {
        if (err.response.email) {
          errorMessage = err.response.email[0];
        } else if (err.response.message) {
          errorMessage = err.response.message;
        } else if (err.response.details) {
          // Show more detailed validation errors
          errorMessage =
            "Invalid data provided: " + JSON.stringify(err.response.details);
        } else if (err.response.error) {
          errorMessage = err.response.error;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Search for email suggestions as user types
  const searchEmailSuggestions = async (query) => {
    if (query.length < 2) {
      setEmailSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSearchingEmail(true);
    emailSearchMutation.mutate(query, {
      onSettled: () => {
        setSearchingEmail(false);
      },
    });
  };

  // Handle email input change with debounce
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    setError("");

    // Reset tenant found status when email changes
    setUserFound(false);
    setEmailChecked(false);

    // Clear any existing timeout
    if (window.emailSearchTimeout) {
      clearTimeout(window.emailSearchTimeout);
    }

    // Set new timeout for debounced search
    if (value.length >= 2) {
      window.emailSearchTimeout = setTimeout(() => {
        searchEmailSuggestions(value);
      }, 300); // 300ms debounce
    } else {
      // Clear suggestions if email is too short
      setEmailSuggestions([]);
      setShowSuggestions(false);
    }

    // Also check if user exists when email is valid
    if (value.length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      if (window.userCheckTimeout) {
        clearTimeout(window.userCheckTimeout);
      }
      window.userCheckTimeout = setTimeout(() => {
        checkUserMutation.mutate(value, {
          onSettled: () => {
            setChecking(false);
          },
        });
      }, 500); // 500ms debounce
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      email: suggestion.email,
      firstName: suggestion.first_name || "",
      lastName: suggestion.last_name || "",
      phone: suggestion.phone || "",
    }));
    setUserFound(true);
    setEmailChecked(true);
    setShowSuggestions(false);
    setEmailSuggestions([]);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".email-search-container")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab("quick-add")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "quick-add"
                ? "border-[#0d9488] text-[#0d9488]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Quick Add
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invite")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "invite"
                ? "border-[#0d9488] text-[#0d9488]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Invite Tenant
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "quick-add" ? (
        <QuickAddForm
          formData={formData}
          setFormData={setFormData}
          properties={properties}
          units={units}
          loadingUnits={loadingUnits}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
          handleChange={handleChange}
          error={error}
          userFound={userFound}
          checking={checking}
          emailSuggestions={emailSuggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          setEmailSuggestions={setEmailSuggestions}
          searchingEmail={searchingEmail}
          emailChecked={emailChecked}
          handleEmailChange={handleEmailChange}
          initialUnitId={initialUnitId}
        />
      ) : (
        <InviteForm
          inviteData={inviteData}
          setInviteData={setInviteData}
          properties={properties}
          units={units}
          loadingUnits={loadingUnits}
          handleInviteChange={handleInviteChange}
        />
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || (activeTab === "quick-add" && !formData.email)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : activeTab === "quick-add"
            ? "Add Tenant"
            : "Send Invitation"}
        </button>
      </div>
    </form>
  );
};

// Quick Add Form Component
const QuickAddForm = ({
  formData,
  setFormData,
  properties,
  units,
  loadingUnits,
  selectedUnit,
  setSelectedUnit,
  handleChange,
  error,
  userFound,
  checking,
  emailSuggestions,
  showSuggestions,
  setShowSuggestions,
  setEmailSuggestions,
  searchingEmail,
  emailChecked,
  handleEmailChange,
  initialUnitId,
}) => {
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      email: suggestion.email,
      firstName: suggestion.first_name || "",
      lastName: suggestion.last_name || "",
      phone: suggestion.phone || "",
    }));
    setShowSuggestions(false);
    setEmailSuggestions([]);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".email-search-container")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Email Field - Always at the top */}
      <div className="email-search-container relative">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Tenant Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleEmailChange(e)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
            autoComplete="off"
            disabled={checking}
            placeholder="Enter email to search for existing users..."
          />
          {searchingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Email Suggestions Dropdown */}
        {showSuggestions && emailSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {emailSuggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.id}`}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {suggestion.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {suggestion.first_name} {suggestion.last_name}
                      {suggestion.phone && ` • ${suggestion.phone}`}
                    </div>
                  </div>
                  <div className="ml-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        suggestion.type === "user"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {suggestion.type === "user"
                        ? "Platform User"
                        : "Existing Tenant"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm mt-2">
            {error}
          </div>
        )}

        {emailChecked && userFound && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm mt-2">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Existing user found! Details have been automatically populated.
              You may edit if needed.
            </div>
          </div>
        )}

        {emailChecked && !userFound && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-yellow-800 text-sm mt-2">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-yellow-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              New tenant detected. Please enter tenant details below.
            </div>
          </div>
        )}
      </div>

      {/* Rest of the form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="propertyId"
            className="block text-sm font-medium text-gray-700"
          >
            Property
          </label>
          <select
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
          >
            <option value="">Select Property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="unitNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Unit
          </label>
          <select
            id="unitNumber"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
            disabled={!formData.propertyId || loadingUnits}
          >
            <option value="">
              {loadingUnits ? "Loading units..." : "Select Unit"}
            </option>
            {units
              .filter((unit) =>
                initialUnitId
                  ? unit.id === initialUnitId
                  : unit.status === "vacant"
              )
              .map((unit) => (
                <option key={unit.id} value={unit.unit_id}>
                  {unit.unit_id}
                </option>
              ))}
          </select>
          {formData.propertyId &&
            !loadingUnits &&
            units.filter((unit) => unit.status === "vacant").length === 0 && (
              <div className="mt-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">
                No vacant units available for this property.
              </div>
            )}
        </div>

        <div>
          <label
            htmlFor="rentAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Monthly Rent
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">KES</span>
            </div>
            <input
              type="number"
              id="rentAmount"
              name="rentAmount"
              value={formData.rentAmount}
              onChange={handleChange}
              className={`block w-full pl-12 rounded-md shadow-sm focus:ring-[#0d9488] focus:ring-2 focus:ring-offset-2 py-2 px-3 sm:text-sm ${
                selectedUnit || initialUnitId
                  ? "border-gray-300 bg-gray-50 text-gray-500"
                  : "border-gray-300 focus:border-[#0d9488] bg-white text-gray-900"
              }`}
              required
              readOnly={!!(selectedUnit || initialUnitId)}
              disabled={!!(selectedUnit || initialUnitId)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="securityDeposit"
            className="block text-sm font-medium text-gray-700"
          >
            Security Deposit
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">KES</span>
            </div>
            <input
              type="number"
              id="securityDeposit"
              name="securityDeposit"
              value={formData.securityDeposit}
              onChange={handleChange}
              className={`block w-full pl-12 rounded-md shadow-sm focus:ring-[#0d9488] focus:ring-2 focus:ring-offset-2 py-2 px-3 sm:text-sm ${
                (selectedUnit && selectedUnit.security_deposit) || initialUnitId
                  ? "border-gray-300 bg-gray-50 text-gray-500"
                  : "border-gray-300 focus:border-[#0d9488] bg-white text-gray-900"
              }`}
              required
              readOnly={
                !!(
                  (selectedUnit && selectedUnit.security_deposit) ||
                  initialUnitId
                )
              }
              disabled={
                !!(
                  (selectedUnit && selectedUnit.security_deposit) ||
                  initialUnitId
                )
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="leaseType"
            className="block text-sm font-medium text-gray-700"
          >
            Agreement Type
          </label>
          <select
            id="leaseType"
            name="leaseType"
            value={formData.leaseType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
          >
            <option value="rental">Rental Agreement</option>
            <option value="lease">Lease Agreement</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        {formData.leaseType === "lease" && (
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
              required
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Emergency Contact (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="emergencyContact.name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="emergencyContact.name"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="emergencyContact.phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="emergencyContact.phone"
              name="emergencyContact.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="emergencyContact.relationship"
              className="block text-sm font-medium text-gray-700"
            >
              Relationship
            </label>
            <input
              type="text"
              id="emergencyContact.relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Invite Form Component
const InviteForm = ({
  inviteData,
  setInviteData,
  properties,
  units,
  loadingUnits,
  handleInviteChange,
}) => {
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingEmail, setSearchingEmail] = useState(false);

  // Search for email suggestions
  const searchEmailSuggestions = async (query) => {
    if (query.length < 2) {
      setEmailSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearchingEmail(true);
    try {
      const response = await apiRequest(
        `/users/search-email/?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
        }
      );
      setEmailSuggestions(response.suggestions || []);
      setShowSuggestions(
        response.suggestions && response.suggestions.length > 0
      );
    } catch (error) {
      setEmailSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSearchingEmail(false);
    }
  };

  // Handle email input change with debounce
  const handleEmailChange = (e) => {
    const value = e.target.value;
    handleInviteChange(e);

    // Clear any existing timeout
    if (window.emailSearchTimeout) {
      clearTimeout(window.emailSearchTimeout);
    }

    // Set new timeout for debounced search
    if (value.length >= 2) {
      window.emailSearchTimeout = setTimeout(() => {
        searchEmailSuggestions(value);
      }, 300); // 300ms debounce
    } else {
      // Clear suggestions if email is too short
      setEmailSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setInviteData((prev) => ({
      ...prev,
      email: suggestion.email,
      phone: suggestion.phone || "",
    }));
    setShowSuggestions(false);
    setEmailSuggestions([]);
  };

  // Handle click outside to close suggestions
  const handleClickOutside = (e) => {
    if (!e.target.closest(".email-search-container")) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Invite Tenant to Join Platform
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Send an invitation to your tenant. They'll receive an email with
                two options:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>
                  <strong>Create Account:</strong> Tenant can sign up and access
                  the full platform
                </li>
                <li>
                  <strong>Quick Approve:</strong> Tenant can approve without
                  creating an account
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="email-search-container relative">
          <label
            htmlFor="inviteEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="inviteEmail"
              name="email"
              value={inviteData.email}
              onChange={handleEmailChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
              placeholder="Enter email to check for existing tenant..."
              required
            />
            {searchingEmail && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* Email Suggestions Dropdown */}
          {showSuggestions && emailSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {emailSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  type="button"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {suggestion.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {suggestion.first_name} {suggestion.last_name}
                        {suggestion.phone && ` • ${suggestion.phone}`}
                      </div>
                    </div>
                    <div className="ml-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          suggestion.type === "user"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {suggestion.type === "user"
                          ? "Platform User"
                          : "Existing Tenant"}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="invitePhone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="invitePhone"
            name="phone"
            value={inviteData.phone}
            onChange={handleInviteChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label
            htmlFor="invitePropertyId"
            className="block text-sm font-medium text-gray-700"
          >
            Property
          </label>
          <select
            id="invitePropertyId"
            name="propertyId"
            value={inviteData.propertyId}
            onChange={handleInviteChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
          >
            <option value="">Select Property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="inviteUnitNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Unit
          </label>
          <select
            id="inviteUnitNumber"
            name="unitNumber"
            value={inviteData.unitNumber}
            onChange={handleInviteChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            required
            disabled={!inviteData.propertyId || loadingUnits}
          >
            <option value="">
              {loadingUnits ? "Loading units..." : "Select Unit"}
            </option>
            {units
              .filter((unit) => unit.status === "vacant")
              .map((unit) => (
                <option key={unit.id} value={unit.unit_id}>
                  {unit.unit_id}
                </option>
              ))}
          </select>
          {inviteData.propertyId &&
            !loadingUnits &&
            units.filter((unit) => unit.status === "vacant").length === 0 && (
              <div className="mt-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">
                No vacant units available for this property.
              </div>
            )}
        </div>

        <div>
          <label
            htmlFor="inviteMessage"
            className="block text-sm font-medium text-gray-700"
          >
            Personal Message (Optional)
          </label>
          <textarea
            id="inviteMessage"
            name="message"
            value={inviteData.message}
            onChange={handleInviteChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            placeholder="Add a personal message to your invitation..."
          />
        </div>
      </div>
    </div>
  );
};

export default AddTenantForm;
