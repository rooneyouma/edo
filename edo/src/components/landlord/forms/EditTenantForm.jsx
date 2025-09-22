import React, { useState, useEffect } from "react";

const EditTenantForm = ({ tenant, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyId: "",
    unitNumber: "",
    rentAmount: "",
    securityDeposit: "",
    leaseType: "rental",
    startDate: "",
    endDate: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });

  useEffect(() => {
    if (tenant) {
      // Split the full name into first and last name
      const [firstName, ...lastNameParts] = tenant.name.split(" ");
      const lastName = lastNameParts.join(" ");

      setFormData({
        firstName,
        lastName,
        email: tenant.email || "",
        phone: tenant.phone || "",
        propertyId: tenant.property || "",
        unitNumber: tenant.unit || "",
        rentAmount: tenant.rent?.toString() || "",
        securityDeposit: tenant.securityDeposit?.toString() || "",
        leaseType: tenant.agreementType || "rental",
        startDate: tenant.leaseStart || "",
        endDate: tenant.leaseEnd || "",
        emergencyContact: {
          name: tenant.emergencyContact?.split(" (")[0] || "",
          phone: tenant.emergencyContact?.match(/\((.*?)\)/)?.[1] || "",
          relationship: "",
        },
      });
    }
  }, [tenant]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Edit Tenant
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="propertyId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Property
          </label>
          <select
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          >
            <option value="">Select Property</option>
            {/* Property options will be populated dynamically */}
          </select>
        </div>

        <div>
          <label
            htmlFor="unitNumber"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Unit Number
          </label>
          <input
            type="text"
            id="unitNumber"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="rentAmount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="securityDeposit"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="leaseType"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Agreement Type
          </label>
          <select
            id="leaseType"
            name="leaseType"
            value={formData.leaseType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          >
            <option value="rental">Rental Agreement</option>
            <option value="lease">Lease Agreement</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        {formData.leaseType === "lease" && (
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
              required
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Emergency Contact (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="emergencyContact.name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="emergencyContact.name"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="emergencyContact.phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Phone
            </label>
            <input
              type="tel"
              id="emergencyContact.phone"
              name="emergencyContact.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="emergencyContact.relationship"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Relationship
            </label>
            <input
              type="text"
              id="emergencyContact.relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 py-2 px-3 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          Update Tenant
        </button>
      </div>
    </form>
  );
};

export default EditTenantForm;
