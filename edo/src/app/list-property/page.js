"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EdoLogo from "@/components/EdoLogo.jsx";
import { ArrowLeft } from "lucide-react";
import Modal from "@/partials/Modal.jsx";

const ListProperty = () => {
  const router = useRouter();
  const [listingType, setListingType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [amenities, setAmenities] = useState("");

  // Wizard step state for BnB
  const [bnbStep, setBnbStep] = useState(1);
  const [bnbData, setBnbData] = useState({
    propertyType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
  });

  // Minimal validation for BnB wizard
  const bnbStepValid = () => {
    if (bnbStep === 1) return !!bnbData.propertyType;
    if (bnbStep === 2) return !!bnbData.title && !!bnbData.description;
    if (bnbStep === 3) return !!bnbData.location && !!bnbData.price;
    if (bnbStep === 4) return true;
    return false;
  };

  const handleBnbChange = (field, value) => {
    setBnbData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBnbNext = () => {
    if (bnbStep < 4 && bnbStepValid()) setBnbStep(bnbStep + 1);
  };
  const handleBnbBack = () => {
    if (bnbStep > 1) setBnbStep(bnbStep - 1);
  };
  const handleBnbSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  // Wizard step state for Rental
  const [rentalStep, setRentalStep] = useState(1);
  const [rentalData, setRentalData] = useState({
    propertyType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
  });

  const rentalStepValid = () => {
    if (rentalStep === 1) return !!rentalData.propertyType;
    if (rentalStep === 2) return !!rentalData.title && !!rentalData.description;
    if (rentalStep === 3) return !!rentalData.location && !!rentalData.price;
    if (rentalStep === 4) return true;
    return false;
  };

  const handleRentalChange = (field, value) => {
    setRentalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRentalNext = () => {
    if (rentalStep < 4 && rentalStepValid()) setRentalStep(rentalStep + 1);
  };
  const handleRentalBack = () => {
    if (rentalStep > 1) setRentalStep(rentalStep - 1);
  };
  const handleRentalSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  // Wizard step state for Property for Sale
  const [propertyStep, setPropertyStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    propertyType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
  });

  const propertyStepValid = () => {
    if (propertyStep === 1) return !!propertyData.propertyType;
    if (propertyStep === 2) return !!propertyData.title;
    if (propertyStep === 3)
      return !!propertyData.location && !!propertyData.price;
    if (propertyStep === 4) return true;
    return false;
  };

  const handlePropertyChange = (field, value) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePropertyNext = () => {
    if (propertyStep < 4 && propertyStepValid())
      setPropertyStep(propertyStep + 1);
  };
  const handlePropertyBack = () => {
    if (propertyStep > 1) setPropertyStep(propertyStep - 1);
  };
  const handlePropertySubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  // Wizard step state for Land & Development
  const [landStep, setLandStep] = useState(1);
  const [landData, setLandData] = useState({
    landType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    area: "",
    amenities: "",
  });

  const landStepValid = () => {
    if (landStep === 1) return !!landData.landType;
    if (landStep === 2) return !!landData.title;
    if (landStep === 3)
      return !!landData.location && !!landData.price && !!landData.area;
    if (landStep === 4) return true;
    return false;
  };

  const handleLandChange = (field, value) => {
    setLandData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLandNext = () => {
    if (landStep < 4 && landStepValid()) setLandStep(landStep + 1);
  };
  const handleLandBack = () => {
    if (landStep > 1) setLandStep(landStep - 1);
  };
  const handleLandSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  // Wizard step state for Commercial Space
  const [commercialStep, setCommercialStep] = useState(1);
  const [commercialData, setCommercialData] = useState({
    propertyType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    area: "",
    amenities: "",
  });

  const commercialStepValid = () => {
    if (commercialStep === 1) return !!commercialData.propertyType;
    if (commercialStep === 2) return !!commercialData.title;
    if (commercialStep === 3)
      return (
        !!commercialData.location &&
        !!commercialData.price &&
        !!commercialData.area
      );
    if (commercialStep === 4) return true;
    return false;
  };

  const handleCommercialChange = (field, value) => {
    setCommercialData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCommercialNext = () => {
    if (commercialStep < 4 && commercialStepValid())
      setCommercialStep(commercialStep + 1);
  };
  const handleCommercialBack = () => {
    if (commercialStep > 1) setCommercialStep(commercialStep - 1);
  };
  const handleCommercialSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the property listing process
    // For now, we'll just navigate back to the marketplace
    router.push("/");
  };

  // Modal state for wizards
  const [openWizard, setOpenWizard] = useState(null); // 'bnb' | 'rental' | 'sale' | 'land' | 'commercial' | null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdfa] via-[#e0f7fa] to-white flex flex-col relative">
      {/* Decorative Accent */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0d9488]/10 rounded-full z-0" />

      {/* Back Button */}
      <button
        className="absolute top-4 left-4 z-50 bg-white/90 p-2 rounded-full hover:bg-gray-100"
        onClick={() => router.back()}
        type="button"
      >
        <ArrowLeft className="h-5 w-5 text-[#0d9488]" />
      </button>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <EdoLogo className="h-12 w-auto inline-block" />
        </div>

        {/* Listing type selection triggers modal for each wizard */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            What would you like to list?
          </label>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setListingType("bnb");
                setOpenWizard("bnb");
              }}
              className={`p-4 border rounded-lg text-left ${
                listingType === "bnb"
                  ? "border-[#0d9488] bg-[#f5f5f7]"
                  : "border-gray-300 hover:border-[#0d9488]"
              }`}
            >
              <h3 className="font-medium">BnB</h3>
              <p className="text-sm text-gray-500">
                Welcome travelers to your unique space
              </p>
            </button>
            <button
              type="button"
              onClick={() => {
                setListingType("rental");
                setOpenWizard("rental");
              }}
              className={`p-4 border rounded-lg text-left ${
                listingType === "rental"
                  ? "border-[#0d9488] bg-[#f5f5f7]"
                  : "border-gray-300 hover:border-[#0d9488]"
              }`}
            >
              <h3 className="font-medium">Rental</h3>
              <p className="text-sm text-gray-500">
                Find the perfect tenant for your property
              </p>
            </button>
            <button
              type="button"
              onClick={() => {
                setListingType("sale");
                setOpenWizard("sale");
              }}
              className={`p-4 border rounded-lg text-left ${
                listingType === "sale"
                  ? "border-[#0d9488] bg-[#f5f5f7]"
                  : "border-gray-300 hover:border-[#0d9488]"
              }`}
            >
              <h3 className="font-medium">Property for Sale</h3>
              <p className="text-sm text-gray-500">
                Connect with potential buyers for your property
              </p>
            </button>
            <button
              type="button"
              onClick={() => {
                setListingType("land");
                setOpenWizard("land");
              }}
              className={`p-4 border rounded-lg text-left ${
                listingType === "land"
                  ? "border-[#0d9488] bg-[#f5f5f7]"
                  : "border-gray-300 hover:border-[#0d9488]"
              }`}
            >
              <h3 className="font-medium">Land & Development</h3>
              <p className="text-sm text-gray-500">
                Showcase your land for development or investment
              </p>
            </button>
            <button
              type="button"
              onClick={() => {
                setListingType("commercial");
                setOpenWizard("commercial");
              }}
              className={`p-4 border rounded-lg text-left ${
                listingType === "commercial"
                  ? "border-[#0d9488] bg-[#f5f5f7]"
                  : "border-gray-300 hover:border-[#0d9488]"
              }`}
            >
              <h3 className="font-medium">Commercial Space</h3>
              <p className="text-sm text-gray-500">
                List your commercial property for businesses
              </p>
            </button>
          </div>
        </div>

        {/* BnB, Rental, Property, Land & Commercial Wizards as Modals */}
        <Modal
          isOpen={openWizard === "bnb"}
          onClose={() => setOpenWizard(null)}
        >
          {listingType === "bnb" && (
            <form onSubmit={handleBnbSubmit} className="space-y-8">
              <style>{`
                /* Hide number input spinners for all browsers */
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }
              `}</style>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-8 rounded-full transition-all duration-200 ${
                      bnbStep >= step ? "bg-[#0d9488]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {bnbStep === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={bnbData.propertyType}
                    onChange={(e) =>
                      handleBnbChange("propertyType", e.target.value)
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    required
                  >
                    <option value="">Select a property type</option>
                    <option value="house">Entire House</option>
                    <option value="apartment">Entire Apartment</option>
                    <option value="room">Private Room</option>
                    <option value="villa">Villa</option>
                    <option value="cabin">Cabin</option>
                  </select>
                </div>
              )}
              {bnbStep === 2 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={bnbData.title}
                      onChange={(e) => handleBnbChange("title", e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={bnbData.description}
                      onChange={(e) =>
                        handleBnbChange("description", e.target.value)
                      }
                      rows={3}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              {bnbStep === 3 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={bnbData.location}
                      onChange={(e) =>
                        handleBnbChange("location", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (per night)
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={bnbData.price}
                      onChange={(e) => handleBnbChange("price", e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                </div>
              )}
              {bnbStep === 4 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={bnbData.bedrooms}
                      onChange={(e) =>
                        handleBnbChange("bedrooms", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={bnbData.bathrooms}
                      onChange={(e) =>
                        handleBnbChange("bathrooms", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities (comma-separated){" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={bnbData.amenities}
                      onChange={(e) =>
                        handleBnbChange("amenities", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBnbBack}
                  disabled={bnbStep === 1}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                >
                  Back
                </button>
                {bnbStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleBnbNext}
                    disabled={!bnbStepValid()}
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          )}
        </Modal>
        <Modal
          isOpen={openWizard === "rental"}
          onClose={() => setOpenWizard(null)}
        >
          {listingType === "rental" && (
            <form onSubmit={handleRentalSubmit} className="space-y-8">
              <style>{`
                /* Hide number input spinners for all browsers */
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }
              `}</style>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-8 rounded-full transition-all duration-200 ${
                      rentalStep >= step ? "bg-[#0d9488]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {rentalStep === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={rentalData.propertyType}
                    onChange={(e) =>
                      handleRentalChange("propertyType", e.target.value)
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    required
                  >
                    <option value="">Select a property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="loft">Loft</option>
                  </select>
                </div>
              )}
              {rentalStep === 2 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={rentalData.title}
                      onChange={(e) =>
                        handleRentalChange("title", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={rentalData.description}
                      onChange={(e) =>
                        handleRentalChange("description", e.target.value)
                      }
                      rows={3}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              {rentalStep === 3 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={rentalData.location}
                      onChange={(e) =>
                        handleRentalChange("location", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (per month)
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={rentalData.price}
                      onChange={(e) =>
                        handleRentalChange("price", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                </div>
              )}
              {rentalStep === 4 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={rentalData.bedrooms}
                      onChange={(e) =>
                        handleRentalChange("bedrooms", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={rentalData.bathrooms}
                      onChange={(e) =>
                        handleRentalChange("bathrooms", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities (comma-separated){" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={rentalData.amenities}
                      onChange={(e) =>
                        handleRentalChange("amenities", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleRentalBack}
                  disabled={rentalStep === 1}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                >
                  Back
                </button>
                {rentalStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleRentalNext}
                    disabled={!rentalStepValid()}
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          )}
        </Modal>
        <Modal
          isOpen={openWizard === "sale"}
          onClose={() => setOpenWizard(null)}
        >
          {listingType === "sale" && (
            <form onSubmit={handlePropertySubmit} className="space-y-8">
              <style>{`
                /* Hide number input spinners for all browsers */
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }
              `}</style>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-8 rounded-full transition-all duration-200 ${
                      propertyStep >= step ? "bg-[#0d9488]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {propertyStep === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={propertyData.propertyType}
                    onChange={(e) =>
                      handlePropertyChange("propertyType", e.target.value)
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    required
                  >
                    <option value="">Select a property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="loft">Loft</option>
                  </select>
                </div>
              )}
              {propertyStep === 2 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={propertyData.title}
                      onChange={(e) =>
                        handlePropertyChange("title", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={propertyData.description}
                      onChange={(e) =>
                        handlePropertyChange("description", e.target.value)
                      }
                      rows={3}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              {propertyStep === 3 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={propertyData.location}
                      onChange={(e) =>
                        handlePropertyChange("location", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={propertyData.price}
                      onChange={(e) =>
                        handlePropertyChange("price", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                </div>
              )}
              {propertyStep === 4 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={propertyData.bedrooms}
                      onChange={(e) =>
                        handlePropertyChange("bedrooms", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={propertyData.bathrooms}
                      onChange={(e) =>
                        handlePropertyChange("bathrooms", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities (comma-separated){" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={propertyData.amenities}
                      onChange={(e) =>
                        handlePropertyChange("amenities", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePropertyBack}
                  disabled={propertyStep === 1}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                >
                  Back
                </button>
                {propertyStep < 4 ? (
                  <button
                    type="button"
                    onClick={handlePropertyNext}
                    disabled={!propertyStepValid()}
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          )}
        </Modal>
        <Modal
          isOpen={openWizard === "land"}
          onClose={() => setOpenWizard(null)}
        >
          {listingType === "land" && (
            <form onSubmit={handleLandSubmit} className="space-y-8">
              <style>{`
                /* Hide number input spinners for all browsers */
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }
              `}</style>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-8 rounded-full transition-all duration-200 ${
                      landStep >= step ? "bg-[#0d9488]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {landStep === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Type
                  </label>
                  <select
                    value={landData.landType}
                    onChange={(e) =>
                      handleLandChange("landType", e.target.value)
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    required
                  >
                    <option value="">Select a land type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="industrial">Industrial</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                </div>
              )}
              {landStep === 2 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={landData.title}
                      onChange={(e) =>
                        handleLandChange("title", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={landData.description}
                      onChange={(e) =>
                        handleLandChange("description", e.target.value)
                      }
                      rows={3}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              {landStep === 3 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={landData.location}
                      onChange={(e) =>
                        handleLandChange("location", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={landData.price}
                      onChange={(e) =>
                        handleLandChange("price", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area (e.g. 5000 sq ft, 2 acres)
                    </label>
                    <input
                      type="text"
                      value={landData.area}
                      onChange={(e) => handleLandChange("area", e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                </div>
              )}
              {landStep === 4 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities (comma-separated){" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={landData.amenities}
                      onChange={(e) =>
                        handleLandChange("amenities", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleLandBack}
                  disabled={landStep === 1}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                >
                  Back
                </button>
                {landStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleLandNext}
                    disabled={!landStepValid()}
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          )}
        </Modal>
        <Modal
          isOpen={openWizard === "commercial"}
          onClose={() => setOpenWizard(null)}
        >
          {listingType === "commercial" && (
            <form onSubmit={handleCommercialSubmit} className="space-y-8">
              <style>{`
                /* Hide number input spinners for all browsers */
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }
              `}</style>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-8 rounded-full transition-all duration-200 ${
                      commercialStep >= step ? "bg-[#0d9488]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {commercialStep === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={commercialData.propertyType}
                    onChange={(e) =>
                      handleCommercialChange("propertyType", e.target.value)
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    required
                  >
                    <option value="">Select a property type</option>
                    <option value="office">Office</option>
                    <option value="retail">Retail</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="industrial">Industrial</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                </div>
              )}
              {commercialStep === 2 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={commercialData.title}
                      onChange={(e) =>
                        handleCommercialChange("title", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={commercialData.description}
                      onChange={(e) =>
                        handleCommercialChange("description", e.target.value)
                      }
                      rows={3}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              {commercialStep === 3 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={commercialData.location}
                      onChange={(e) =>
                        handleCommercialChange("location", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={commercialData.price}
                      onChange={(e) =>
                        handleCommercialChange("price", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area (e.g. 2000 sq ft, 3 floors)
                    </label>
                    <input
                      type="text"
                      value={commercialData.area}
                      onChange={(e) =>
                        handleCommercialChange("area", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      required
                    />
                  </div>
                </div>
              )}
              {commercialStep === 4 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities (comma-separated){" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={commercialData.amenities}
                      onChange={(e) =>
                        handleCommercialChange("amenities", e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleCommercialBack}
                  disabled={commercialStep === 1}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                >
                  Back
                </button>
                {commercialStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleCommercialNext}
                    disabled={!commercialStepValid()}
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-[#0d9488] text-white font-medium"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ListProperty;
