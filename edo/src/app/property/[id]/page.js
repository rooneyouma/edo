"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  User,
  Phone,
  Mail,
  Share2,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  Coffee,
  Snowflake,
  Tv,
  Utensils,
  ArrowLeft,
} from "lucide-react";

const PropertyDetails = ({ params }) => {
  const [propertyId, setPropertyId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Unwrap the params Promise to get the id
    Promise.resolve(params).then((unwrappedParams) => {
      setPropertyId(unwrappedParams.id);
    });
  }, [params]);

  // Mock data - replace with actual API call
  const property = {
    id: propertyId || 1,
    title: "Modern Downtown Apartment",
    price: 2500,
    location: "123 Main St, Downtown",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    ],
    features: ["Parking", "Gym", "Pool", "Security", "24/7 Maintenance"],
    description:
      "Beautiful modern apartment in the heart of downtown with amazing city views. This spacious 2-bedroom, 2-bathroom apartment features an open-concept living area, modern appliances, and large windows that flood the space with natural light. The master bedroom includes a walk-in closet and en-suite bathroom. The building offers premium amenities including a fitness center, swimming pool, and secure parking.",
    availableFrom: "2024-04-01",
    landlord: {
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "john.smith@example.com",
      rating: 4.8,
      reviews: 124,
      responseTime: "within an hour",
      memberSince: "2020",
    },
    amenities: [
      { name: "Air Conditioning", icon: <Snowflake className="w-5 h-5" /> },
      { name: "Washer/Dryer", icon: <Utensils className="w-5 h-5" /> },
      { name: "Dishwasher", icon: <Utensils className="w-5 h-5" /> },
      { name: "Balcony", icon: <Coffee className="w-5 h-5" /> },
      { name: "Hardwood Floors", icon: <Tv className="w-5 h-5" /> },
      { name: "Walk-in Closet", icon: <Car className="w-5 h-5" /> },
      { name: "Central Heating", icon: <Snowflake className="w-5 h-5" /> },
      { name: "High-Speed Internet", icon: <Wifi className="w-5 h-5" /> },
    ],
    highlights: [
      "Prime downtown location",
      "Stunning city views",
      "Modern appliances",
      "Secure building access",
      "Fitness center access",
      "Swimming pool",
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );
  };

  // Render nothing until we have the propertyId
  if (!propertyId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 flex items-center text-[#0d9488] hover:underline z-50 bg-white/90 px-3 py-1 rounded"
        onClick={() => router.back()}
        type="button"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back
      </button>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-8">
        <div className="relative aspect-[4/3] bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-property.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {property.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden"
            >
              <img
                src={image}
                alt={`${property.title} - View ${index + 2}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-property.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[90rem] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {property.title}
                </h1>
                <div className="mt-1 sm:mt-2 flex items-center text-sm sm:text-base text-gray-500">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 text-lg sm:text-xl lg:text-2xl font-bold text-[#0d9488]">
                ${property.price}/mo
              </div>
            </div>

            {/* Key Features */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-600">
              <div className="flex items-center">
                <Bed className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span>{property.bedrooms} beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span>{property.bathrooms} baths</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span>{property.area} sqft</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  Available{" "}
                  {new Date(property.availableFrom).toLocaleDateString()}
                </span>
                <span className="sm:hidden">
                  Avail. {new Date(property.availableFrom).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-6 sm:mt-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Highlights
              </h2>
              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {property.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm sm:text-base text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 sm:mt-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Description
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mt-6 sm:mt-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Amenities
              </h2>
              <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-600"
                  >
                    <div className="text-violet-600">{amenity.icon}</div>
                    <span className="line-clamp-1">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-24 bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    {property.landlord.name}
                  </h3>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>
                      {property.landlord.rating} ({property.landlord.reviews}{" "}
                      reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488]" />
                  <span>Response time: {property.landlord.responseTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488]" />
                  <span>Member since {property.landlord.memberSince}</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                <button className="w-full bg-[#0d9488] text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-[#0f766e] transition-colors text-sm sm:text-base">
                  Schedule a Viewing
                </button>
                <button className="w-full border border-[#0d9488] text-[#0d9488] py-2.5 sm:py-3 px-4 rounded-lg hover:bg-[#f5f5f7] transition-colors text-sm sm:text-base">
                  Contact Landlord
                </button>
              </div>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <span>{property.landlord.phone}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <span className="line-clamp-1">
                    {property.landlord.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
