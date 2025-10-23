import React, { useState, useEffect } from "react";
import CustomSelect from "../../ui/CustomSelect";

const AddPropertyForm = ({ property, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    description: "",
  });

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || "",
        type: property.type || "",
        address: {
          street: property.street || "",
          city: property.city || "",
          state: property.state || "",
          zipCode: property.zip_code || "",
        },
        description: property.description || "",
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
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
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Property Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Property Type
        </label>
        <CustomSelect
          id="type"
          options={[
            { value: "", label: "Select Type" },
            { value: "House", label: "House" },
            { value: "Apartment", label: "Apartment" },
            { value: "Villa", label: "Villa" },
            { value: "Townhouse", label: "Townhouse" },
            { value: "Office", label: "Office" },
            { value: "Commercial", label: "Commercial" },
            { value: "Other", label: "Other" },
          ]}
          value={formData.type}
          onChange={(value) =>
            handleChange({ target: { name: "type", value } })
          }
          required
          className="mt-1"
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label
              htmlFor="address.street"
              className="block text-sm font-medium text-gray-700"
            >
              Street Address
            </label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="address.city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              id="address.city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="address.state"
              className="block text-sm font-medium text-gray-700"
            >
              State
            </label>
            <input
              type="text"
              id="address.state"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="address.zipCode"
              className="block text-sm font-medium text-gray-700"
            >
              ZIP Code
            </label>
            <input
              type="text"
              id="address.zipCode"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
        />
      </div>

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
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          {property ? "Save Changes" : "Add Property"}
        </button>
      </div>
    </form>
  );
};

export default AddPropertyForm;
