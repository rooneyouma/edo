import React, { useState } from "react";
import { authAPI, landlordPropertyAPI } from "../utils/api";

const OnboardRoleModal = ({
  isOpen,
  onClose,
  onSuccess,
  roleName = "landlord", // Default to landlord for backward compatibility
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");
  const [propertyUnits, setPropertyUnits] = useState(1);

  const handleOnboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, add the role to the user
      const response = await authAPI.addRoleToCurrentUser(roleName);

      if (roleName === "landlord" && step === 2) {
        // If landlord and we're on step 2, also create the first property
        try {
          await landlordPropertyAPI.create({
            name: propertyName,
            address: propertyAddress,
            property_type: propertyType,
            total_units: propertyUnits,
            description: `Initial property added during onboarding`,
          });
        } catch (propertyError) {
          console.error(
            "Failed to create property, but role was added:",
            propertyError
          );
          // Don't fail the onboarding if property creation fails
        }
      }

      // Get updated user data
      const updatedUser = await authAPI.getCurrentUser();
      onSuccess(updatedUser.roles);
      onClose();
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (roleName === "landlord" && step === 1) {
      setStep(2);
    } else {
      handleOnboard();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(1);
    }
  };

  if (!isOpen) return null;

  const isLandlord = roleName === "landlord";
  const showPropertyForm = isLandlord && step === 2;
  const canProceed =
    step === 1 || (showPropertyForm && propertyName && propertyAddress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gradient-to-br from-white via-gray-50 to-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-200/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#009688] to-[#33bbaa] bg-clip-text text-transparent">
          {step === 1
            ? `Become a ${roleName.charAt(0).toUpperCase() + roleName.slice(1)}`
            : "Add Your First Property"}
        </h2>

        {isLandlord && (
          <div className="mb-6 flex justify-center">
            <div className="flex gap-2">
              {[1, 2].map((stepNum) => (
                <span
                  key={stepNum}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step >= stepNum
                      ? "bg-gradient-to-r from-[#009688] to-[#33bbaa] scale-110"
                      : "bg-gray-300"
                  }`}
                ></span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          {step === 1 && (
            <p className="text-gray-700 text-center">
              To access this portal, you need to onboard as a <b>{roleName}</b>.
              <br />
              {isLandlord &&
                "After onboarding, you'll be able to add your first property."}
              <br />
              Would you like to proceed?
            </p>
          )}

          {showPropertyForm && (
            <div className="space-y-4">
              <p className="text-gray-700 text-center mb-4">
                Let's start by adding your first property to manage.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] transition-all duration-300"
                  placeholder="e.g., Sunset Apartments"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Address *
                </label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] transition-all duration-300"
                  placeholder="e.g., 123 Main Street, City, State"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] transition-all duration-300"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="duplex">Duplex</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={propertyUnits}
                    onChange={(e) =>
                      setPropertyUnits(parseInt(e.target.value) || 1)
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium border border-gray-200 hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
            >
              Back
            </button>
          )}

          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium border border-gray-200 hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleNext}
            disabled={loading || !canProceed}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
          >
            {loading
              ? "Processing..."
              : step === 1 && isLandlord
              ? "Next"
              : showPropertyForm
              ? "Complete Setup"
              : `Become ${roleName}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardRoleModal;
