import React, { useState } from "react";
import {
  MapPin,
  Home,
  DollarSign,
  Bed,
  Bath,
  Square,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CustomSelect from "../../ui/CustomSelect";

const steps = [
  "Basic Info",
  "Details",
  "Amenities",
  "Photos",
  "Description",
  "Preview",
];

const AddPropertyForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "House",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    amenities: [],
    photos: [],
  });
  const [step, setStep] = useState(0);

  const propertyTypes = ["House", "Apartment", "Cabin", "Villa", "Condo"];

  const commonAmenities = [
    "WiFi",
    "Parking",
    "Pool",
    "Gym",
    "Air Conditioning",
    "Heating",
    "Washer/Dryer",
    "Kitchen",
    "TV",
    "Security System",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: files,
    }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((label, idx) => (
          <div
            key={label}
            className={`flex-1 h-2 rounded-full ${
              idx <= step ? "bg-teal-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          ></div>
        ))}
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
        {steps[step]}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Listing Title
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Location
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>
        )}
        {/* Step 2: Details */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Property Type
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="h-5 w-5 text-gray-400" />
                </div>
                <CustomSelect
                  id="type"
                  label="Property Type"
                  options={propertyTypes.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  value={formData.type}
                  onChange={(value) =>
                    handleChange({ target: { name: "type", value } })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Price per Night
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Bedrooms
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Bed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  required
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="bathrooms"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Bathrooms
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Bath className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="bathrooms"
                  id="bathrooms"
                  required
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Area (sqft)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Square className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="area"
                  id="area"
                  required
                  min="0"
                  value={formData.area}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}
        {/* Step 3: Amenities */}
        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {commonAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label
                    htmlFor={amenity}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Step 4: Photos */}
        {step === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            {formData.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formData.photos.map((file, idx) => (
                  <div
                    key={idx}
                    className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex items-center justify-center"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Step 5: Description */}
        {step === 4 && (
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>
        )}
        {/* Step 6: Preview & Submit */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Preview Listing
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="font-semibold">{formData.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {formData.location}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {formData.type} • {formData.bedrooms} bd • {formData.bathrooms}{" "}
                ba • {formData.area} sqft
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                ${formData.price}/night
              </div>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                {formData.description}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.amenities.map((a) => (
                  <span
                    key={a}
                    className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 text-xs"
                  >
                    {a}
                  </span>
                ))}
              </div>
              {formData.photos.length > 0 && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {formData.photos.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="object-cover w-full h-20 rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3 mt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center px-3 py-2 rounded-md border border-transparent bg-teal-600 text-white text-xs sm:text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center px-3 py-2 rounded-md border border-transparent bg-teal-600 text-white text-xs sm:text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Submit Listing
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default AddPropertyForm;
