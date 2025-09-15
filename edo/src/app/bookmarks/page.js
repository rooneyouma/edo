"use client";

import React, { useState, useEffect } from "react";
import PropertyCard from "@/components/marketplace/PropertyCard.jsx";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const Bookmarks = () => {
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Load bookmarked properties from localStorage
    const savedBookmarks = localStorage.getItem("bookmarkedProperties");
    if (savedBookmarks) {
      const bookmarkedIds = JSON.parse(savedBookmarks);
      setBookmarkedProperties(bookmarkedIds);

      // Load the actual property data for bookmarked properties
      const mockProperties = [
        {
          id: 1,
          title: "Modern Downtown Apartment",
          price: 2500,
          location: "123 Main St, Downtown",
          type: "apartment",
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          features: ["Parking", "Gym", "Pool"],
          description:
            "Beautiful modern apartment in the heart of downtown with amazing city views.",
        },
        {
          id: 2,
          title: "Spacious Family Home",
          price: 4500,
          location: "456 Oak Ave, Suburbs",
          type: "house",
          bedrooms: 4,
          bathrooms: 3,
          area: 2500,
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
          features: ["Garden", "Garage", "Fireplace"],
          description:
            "Perfect family home with a large backyard and modern amenities.",
        },
        {
          id: 3,
          title: "Luxury Waterfront Condo",
          price: 3800,
          location: "789 Harbor Blvd, Waterfront",
          type: "condo",
          bedrooms: 3,
          bathrooms: 2,
          area: 1800,
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
          features: ["Water View", "Balcony", "Concierge"],
          description:
            "Stunning waterfront condo with panoramic views and luxury finishes.",
        },
        {
          id: 4,
          title: "Cozy Studio Apartment",
          price: 1500,
          location: "321 Pine St, Midtown",
          type: "apartment",
          bedrooms: 1,
          bathrooms: 1,
          area: 650,
          image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
          features: ["Modern Kitchen", "Walk-in Closet", "High Ceilings"],
          description:
            "Efficiently designed studio apartment perfect for urban living.",
        },
        {
          id: 5,
          title: "Contemporary Townhouse",
          price: 3200,
          location: "567 Maple Dr, Uptown",
          type: "townhouse",
          bedrooms: 3,
          bathrooms: 2.5,
          area: 1600,
          image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          features: ["Private Patio", "Modern Appliances", "Storage"],
          description:
            "Stylish townhouse with contemporary design and ample living space.",
        },
      ];

      const bookmarkedPropertiesData = mockProperties.filter((property) =>
        bookmarkedIds.includes(property.id)
      );
      setProperties(bookmarkedPropertiesData);
    }
  }, []);

  const handleBookmarkToggle = (propertyId) => {
    setBookmarkedProperties((prev) => {
      const newBookmarks = prev.filter((id) => id !== propertyId);
      localStorage.setItem(
        "bookmarkedProperties",
        JSON.stringify(newBookmarks)
      );
      return newBookmarks;
    });
    setProperties((prev) =>
      prev.filter((property) => property.id !== propertyId)
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 flex items-center text-[#0d9488] hover:underline z-50 bg-white/90 px-3 py-1 rounded"
        onClick={() => router.back()}
        type="button"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bookmarked Properties
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Your saved properties for easy access
          </p>
        </div>
      </div>

      {/* Bookmarked Properties */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{ ...property, isBookmarked: true }}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 sm:h-24 w-16 sm:w-24 text-[#0d9488]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">
              No bookmarked properties
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Start bookmarking properties to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
