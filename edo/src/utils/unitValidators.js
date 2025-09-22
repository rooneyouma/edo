/**
 * Unit Type-Specific Field Validator Utility
 * Provides specialized validation logic for different property types
 */

import { getPropertyTypeConfig } from "./propertyTypeConfigs";

/**
 * Advanced validation rules specific to property types
 */
const ADVANCED_VALIDATION_RULES = {
  House: {
    // Houses should have reasonable bedroom/bathroom ratios
    validateBedroomBathroomRatio: (bedrooms, bathrooms) => {
      if (bedrooms > 0 && bathrooms > 0) {
        const ratio = bedrooms / bathrooms;
        if (ratio > 4) {
          return "Houses typically have more bathrooms relative to bedrooms. Consider adding more bathrooms.";
        }
      }
      return null;
    },
  },

  Apartment: {
    // Floor validation for apartments
    validateFloor: (floor) => {
      if (floor && !isNaN(floor)) {
        const floorNum = parseInt(floor);
        if (floorNum > 50) {
          return "Floor number seems unusually high for most apartment buildings.";
        }
        if (floorNum < 0) {
          return 'Basement levels should be indicated as "B1", "B2", etc.';
        }
      }
      return null;
    },
  },

  Villa: {
    // Villas have luxury standards
    validateVillaStandards: (bedrooms, bathrooms) => {
      if (bedrooms < 3) {
        return "Villas typically have at least 3 bedrooms to qualify as luxury properties.";
      }
      if (bathrooms && bedrooms && bathrooms < Math.ceil(bedrooms * 0.75)) {
        return "Villas typically have more bathrooms relative to bedrooms for luxury comfort.";
      }
      return null;
    },
  },

  Townhouse: {
    // Townhouses have specific characteristics
    validateTownhouseLayout: (bedrooms, bathrooms, floor) => {
      if (bedrooms < 2) {
        return "Townhouses typically have at least 2 bedrooms due to their multi-level design.";
      }
      if (floor && !isNaN(floor) && parseInt(floor) < 2) {
        return "Townhouses are typically multi-story. Consider specifying number of floors (e.g., 2, 3).";
      }
      return null;
    },
  },

  Office: {
    // Office space validation
    validateOfficeSpace: (bedrooms) => {
      if (bedrooms && bedrooms > 10) {
        return 'Large office spaces might be better described as "Open Areas" rather than individual offices.';
      }
      return null;
    },
    // Office floor validation
    validateOfficeFloor: (floor) => {
      if (floor && !isNaN(floor) && parseInt(floor) > 100) {
        return "Floor number seems unusually high. Please verify the floor number.";
      }
      return null;
    },
  },

  Commercial: {
    // Commercial space validation
    validateCommercialRooms: (bedrooms) => {
      if (bedrooms && bedrooms > 20) {
        return "Large commercial spaces might be better described by total area rather than individual rooms.";
      }
      return null;
    },
  },
};

/**
 * Rent validation based on property type
 */
const validateRentAmount = (rent, propertyType, bedrooms) => {
  if (!rent || rent <= 0) return null;

  // Property type specific rent validation
  const warnings = [];

  switch (propertyType) {
    case "Apartment":
      if (bedrooms === 0 && rent > 3000) {
        warnings.push("Studio apartment rent seems high for the market.");
      }
      break;
    case "Villa":
      if (rent < 2000) {
        warnings.push("Villa rent seems low for luxury property standards.");
      }
      break;
  }

  return warnings.length > 0 ? warnings[0] : null;
};

/**
 * Security deposit validation
 */
const validateSecurityDeposit = (deposit, rent, propertyType) => {
  if (!deposit || !rent) return null;

  const ratio = deposit / rent;

  if (ratio > 3) {
    return "Security deposit seems unusually high (more than 3 months rent).";
  }

  if (ratio < 0.5 && ["Villa", "Commercial", "Office"].includes(propertyType)) {
    return `${propertyType}s typically require higher security deposits for protection.`;
  }

  return null;
};

/**
 * Main validation function that combines all validations
 */
export const validateUnitForm = (formData, propertyType) => {
  const config = getPropertyTypeConfig(propertyType);
  const errors = {};
  const warnings = {};

  // Basic field validation from config
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

  // Advanced property-type specific validation
  const advancedRules = ADVANCED_VALIDATION_RULES[propertyType];
  if (advancedRules) {
    const { bedrooms, bathrooms, floor, rent_amount } = formData;

    // Apply advanced validation rules
    Object.entries(advancedRules).forEach(([ruleName, ruleFunction]) => {
      let warning = null;

      try {
        if (ruleName === "validateBedroomBathroomRatio") {
          warning = ruleFunction(Number(bedrooms), Number(bathrooms));
        } else if (ruleName === "validateFloor") {
          warning = ruleFunction(floor);
        } else if (ruleName === "validateVillaStandards") {
          warning = ruleFunction(Number(bedrooms), Number(bathrooms));
        } else if (ruleName === "validateTownhouseLayout") {
          warning = ruleFunction(Number(bedrooms), Number(bathrooms), floor);
        } else if (ruleName === "validateOfficeSpace") {
          warning = ruleFunction(Number(bedrooms));
        } else if (ruleName === "validateOfficeFloor") {
          warning = ruleFunction(floor);
        } else if (ruleName === "validateCommercialRooms") {
          warning = ruleFunction(Number(bedrooms));
        }

        if (warning) {
          warnings.general = warnings.general || [];
          warnings.general.push(warning);
        }
      } catch (e) {
        // Ignore validation errors for incomplete data
      }
    });
  }

  // Rent validation
  const rentWarning = validateRentAmount(
    Number(formData.rent_amount),
    propertyType,
    Number(formData.bedrooms)
  );
  if (rentWarning) {
    warnings.rent_amount = rentWarning;
  }

  // Security deposit validation
  const depositWarning = validateSecurityDeposit(
    Number(formData.security_deposit),
    Number(formData.rent_amount),
    propertyType
  );
  if (depositWarning) {
    warnings.security_deposit = depositWarning;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    hasWarnings: Object.keys(warnings).length > 0,
  };
};

/**
 * Get property type specific tips for users
 */
export const getPropertyTypeTips = (propertyType) => {
  const tips = {
    House: [
      "Consider including yard access and parking information",
      "Mention if utilities are included or separate",
      "Specify if pets are allowed",
      "Include information about neighborhood amenities",
    ],
    Apartment: [
      "Mention elevator access for higher floors",
      "Include information about building amenities",
      "Specify if parking is available",
      "Note if utilities are included in rent",
    ],
    Villa: [
      "Highlight luxury features like pools or gardens",
      "Mention security features and gated community access",
      "Include information about staff quarters if available",
      "Specify maintenance and landscaping arrangements",
    ],
    Townhouse: [
      "Mention HOA fees and community amenities",
      "Include information about shared walls and privacy",
      "Specify garage and driveway parking",
      "Note any community maintenance responsibilities",
    ],
    Office: [
      "Include information about business hours and access",
      "Mention available conference room facilities",
      "Specify internet and utility arrangements",
      "Note parking availability for clients and employees",
    ],
    Commercial: [
      "Specify zoning restrictions and permitted uses",
      "Include information about foot traffic and visibility",
      "Mention loading dock and storage capabilities",
      "Note any required business licenses or permits",
    ],
  };

  return tips[propertyType] || tips.House;
};

/**
 * Get field-specific help text based on property type
 */
export const getFieldHelpText = (fieldName, propertyType) => {
  const helpTexts = {
    House: {
      bedrooms: "Include all bedrooms, even if currently used as office/den",
      bathrooms: "Include half-baths (powder rooms) as 0.5",
    },
    Apartment: {
      floor: "Use 'G' for ground floor, 'B1' for basement level",
      bedrooms: "Studio apartments should be marked as 0 bedrooms",
    },
    Villa: {
      bedrooms: "Count only actual bedrooms, not studies or dens",
    },
    Office: {
      bedrooms: "Count as individual private offices",
    },
  };

  return helpTexts[propertyType]?.[fieldName] || null;
};
