/**
 * Property Type Configurations
 * Defines specific fields, defaults, and validation rules for different property types
 */

export const PROPERTY_TYPE_CONFIGS = {
  House: {
    name: "House",
    unitIdLabel: "House Unit",
    unitIdPlaceholder: "e.g. Main House, Guest House, 1A",
    fields: {
      unit_id: { required: true, label: "Unit ID" },
      bedrooms: {
        required: true,
        label: "Bedrooms",
        min: 1,
        max: 10,
        default: 3,
      },
      bathrooms: {
        required: true,
        label: "Bathrooms",
        min: 1,
        max: 8,
        default: 2,
        step: 0.5,
      },
      rent_amount: { required: true, label: "Monthly Rent", min: 0 },
      security_deposit: { required: false, label: "Security Deposit", min: 0 },
      status: { required: true, label: "Status", default: "vacant" },
    },
    layout: [
      ["unit_id"],
      ["bedrooms", "bathrooms"],
      ["rent_amount", "security_deposit"],
      ["status"],
    ],
  },

  Apartment: {
    name: "Apartment",
    unitIdLabel: "Apartment Number",
    unitIdPlaceholder: "e.g. 101, 2A, A-205",
    floorLabel: "Floor",
    floorPlaceholder: "e.g. 1, 2, 15, Ground",
    fields: {
      unit_id: { required: true, label: "Apartment Number" },
      floor: { required: true, label: "Floor" },
      bedrooms: {
        required: true,
        label: "Bedrooms",
        min: 0,
        max: 6,
        default: 1,
      },
      bathrooms: {
        required: true,
        label: "Bathrooms",
        min: 1,
        max: 4,
        default: 1,
        step: 0.5,
      },
      rent_amount: { required: true, label: "Monthly Rent", min: 0 },
      security_deposit: { required: false, label: "Security Deposit", min: 0 },
      status: { required: true, label: "Status", default: "vacant" },
    },
    layout: [
      ["unit_id", "floor"],
      ["bedrooms", "bathrooms"],
      ["rent_amount", "security_deposit"],
      ["status"],
    ],
  },

  Villa: {
    name: "Villa",
    unitIdLabel: "Villa Unit",
    unitIdPlaceholder: "e.g. Villa A, Main Villa, Pool Villa",
    floorLabel: "Number of Floors",
    floorPlaceholder: "e.g. 1, 2, 3",
    fields: {
      unit_id: { required: true, label: "Villa Unit" },
      floor: { required: false, label: "Number of Floors" },
      bedrooms: {
        required: true,
        label: "Bedrooms",
        min: 2,
        max: 12,
        default: 4,
      },
      bathrooms: {
        required: true,
        label: "Bathrooms",
        min: 2,
        max: 10,
        default: 3,
        step: 0.5,
      },
      rent_amount: { required: true, label: "Monthly Rent", min: 0 },
      security_deposit: { required: false, label: "Security Deposit", min: 0 },
      status: { required: true, label: "Status", default: "vacant" },
    },
    layout: [
      ["unit_id"],
      ["floor"],
      ["bedrooms", "bathrooms"],
      ["rent_amount", "security_deposit"],
      ["status"],
    ],
  },

  Townhouse: {
    name: "Townhouse",
    unitIdLabel: "Townhouse Number",
    unitIdPlaceholder: "e.g. TH-1, Unit 5, Row 3A",
    floorLabel: "Number of Floors",
    floorPlaceholder: "e.g. 2, 3",
    fields: {
      unit_id: { required: true, label: "Townhouse Number" },
      floor: { required: false, label: "Number of Floors" },
      bedrooms: {
        required: true,
        label: "Bedrooms",
        min: 2,
        max: 8,
        default: 3,
      },
      bathrooms: {
        required: true,
        label: "Bathrooms",
        min: 1,
        max: 6,
        default: 2,
        step: 0.5,
      },
      rent_amount: { required: true, label: "Monthly Rent", min: 0 },
      security_deposit: { required: false, label: "Security Deposit", min: 0 },
      status: { required: true, label: "Status", default: "vacant" },
    },
    layout: [
      ["unit_id"],
      ["floor"],
      ["bedrooms", "bathrooms"],
      ["rent_amount", "security_deposit"],
      ["status"],
    ],
  },

  Office: {
    name: "Office",
    unitIdLabel: "Office/Suite Number",
    unitIdPlaceholder: "e.g. Suite 200, Office 15A",
    floorLabel: "Floor",
    floorPlaceholder: "e.g. 1, 2, Ground, Mezzanine",
    fields: {
      unit_id: { required: true, label: "Office/Suite Number" },
      floor: { required: true, label: "Floor" },
      bedrooms: {
        required: false,
        label: "Private Offices",
        min: 0,
        max: 20,
        default: 1,
      },
      bathrooms: {
        required: true,
        label: "Restrooms",
        min: 0,
        max: 10,
        default: 1,
      },
      rent_amount: { required: true, label: "Monthly Rent", min: 0 },
      security_deposit: { required: false, label: "Security Deposit", min: 0 },
      status: { required: true, label: "Status", default: "vacant" },
    },
    layout: [
      ["unit_id", "floor"],
      ["bedrooms", "bathrooms"],
      ["rent_amount", "security_deposit"],
      ["status"],
    ],
  },

  Commercial: {
    name: "Commercial",
    unitIdLabel: "Unit/Space Number",
    unitIdPlaceholder: "e.g. Unit 1, Store A, Shop 15",
    floorLabel: "Floor/Level",
    floorPlaceholder: "e.g. Ground, 1st Floor, Basement",
    fields: {
      unit_id: { required: true, label: "Unit/Space Number" },
      floor: { required: false, label: "Floor/Level" },
      bedrooms: {
        required: false,
        label: "Rooms/Spaces",
        min: 0,
        max: 50,
        default: 1,
      },
      bathrooms: {
        required: true,
        label: "Restrooms",
        min: 0,
        max: 20,
        default: 1,
      },
      rent_amount: { required: true, label: "Monthly Rent", min: 0 },
      security_deposit: { required: false, label: "Security Deposit", min: 0 },
      status: { required: true, label: "Status", default: "vacant" },
    },
    layout: [
      ["unit_id", "floor"],
      ["bedrooms", "bathrooms"],
      ["rent_amount", "security_deposit"],
      ["status"],
    ],
  },

  Other: {
    name: "Other",
    unitIdLabel: "Unit ID",
    unitIdPlaceholder: "e.g. Unit 1, Space A",
    floorLabel: "Floor/Level",
    floorPlaceholder: "e.g. Ground, 1st Floor",
    fields: {
      unit_id: { required: true, label: "Unit ID" },
      floor: { required: false, label: "Floor/Level" },
      bedrooms: {
        required: false,
        label: "Rooms",
        min: 0,
        max: 20,
        default: 1,
      },
      bathrooms: {
        required: false,
        label: "Bathrooms",
        min: 0,
        max: 10,
        default: 1,
        step: 0.5,
      },
      rent_amount: { required: true, label: "Monthly Rent", min: 0 },
      security_deposit: { required: false, label: "Security Deposit", min: 0 },
      status: { required: true, label: "Status", default: "vacant" },
    },
    layout: [
      ["unit_id", "floor"],
      ["bedrooms", "bathrooms"],
      ["rent_amount", "security_deposit"],
      ["status"],
    ],
  },
};

/**
 * Get configuration for a specific property type
 * @param {string} propertyType - The property type
 * @returns {object} Configuration object for the property type
 */
export const getPropertyTypeConfig = (propertyType) => {
  return PROPERTY_TYPE_CONFIGS[propertyType] || PROPERTY_TYPE_CONFIGS.Other;
};

/**
 * Get default form data for a property type
 * @param {string} propertyType - The property type
 * @returns {object} Default form data object
 */
export const getDefaultFormData = (propertyType) => {
  const config = getPropertyTypeConfig(propertyType);
  const defaultData = {};

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    if (fieldConfig.default !== undefined) {
      defaultData[fieldName] = fieldConfig.default;
    } else if (fieldConfig.type === "boolean") {
      defaultData[fieldName] = false;
    } else if (fieldConfig.required && fieldName !== "unit_id") {
      if (fieldName === "bedrooms" || fieldName === "bathrooms") {
        defaultData[fieldName] = fieldConfig.min || 1;
      } else {
        defaultData[fieldName] = "";
      }
    } else {
      defaultData[fieldName] = "";
    }
  });

  return defaultData;
};

/**
 * Validate form data based on property type configuration
 * @param {object} formData - The form data to validate
 * @param {string} propertyType - The property type
 * @returns {object} Validation result with errors
 */
export const validateFormData = (formData, propertyType) => {
  const config = getPropertyTypeConfig(propertyType);
  const errors = {};

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    const value = formData[fieldName];

    // Required field validation
    if (fieldConfig.required) {
      if (value === "" || value === null || value === undefined) {
        errors[fieldName] = `${fieldConfig.label} is required`;
        return;
      }
    }

    // Skip validation for empty optional fields
    if (
      !fieldConfig.required &&
      (value === "" || value === null || value === undefined)
    ) {
      return;
    }

    // Numeric validation
    if (fieldConfig.min !== undefined || fieldConfig.max !== undefined) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors[fieldName] = `${fieldConfig.label} must be a number`;
      } else {
        if (fieldConfig.min !== undefined && numValue < fieldConfig.min) {
          errors[
            fieldName
          ] = `${fieldConfig.label} must be at least ${fieldConfig.min}`;
        }
        if (fieldConfig.max !== undefined && numValue > fieldConfig.max) {
          errors[
            fieldName
          ] = `${fieldConfig.label} must be no more than ${fieldConfig.max}`;
        }
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get field layout for a property type
 * @param {string} propertyType - The property type
 * @returns {array} Array of field rows for layout
 */
export const getFieldLayout = (propertyType) => {
  const config = getPropertyTypeConfig(propertyType);
  return config.layout;
};
