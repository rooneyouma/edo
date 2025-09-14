"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchFilters from "../components/marketplace/SearchFilters.jsx";
import PropertyCard from "../components/marketplace/PropertyCard.jsx";
import MarketplaceNav from "../components/marketplace/MarketplaceNav.jsx";
import {
  HomeIcon,
  BuildingOfficeIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import EdoLogo from "../components/EdoLogo.jsx";
import { becomeLandlord, authAPI, isAuthenticated } from "../utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MarketplaceHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [propertyType, setPropertyType] = useState("all");
  const [transactionType, setTransactionType] = useState("all");
  const [bedrooms, setBedrooms] = useState("any");
  const [bathrooms, setBathrooms] = useState("any");
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showPropertyManagerModal, setShowPropertyManagerModal] =
    useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PROPERTIES_PER_PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);
  const [landlordStep, setLandlordStep] = useState(1);
  const [tenantStep, setTenantStep] = useState(1);
  const [landlordId, setLandlordId] = useState("");
  const [landlordProperty, setLandlordProperty] = useState("");
  const [tenantPolicyAccepted, setTenantPolicyAccepted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Load bookmarked properties from localStorage
    const savedBookmarks = localStorage.getItem("bookmarkedProperties");
    if (savedBookmarks) {
      setBookmarkedProperties(JSON.parse(savedBookmarks));
    }
  }, []);

  // Memoize properties with isBookmarked
  const properties = useMemo(
    () =>
      [
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
        {
          id: 6,
          title: "Penthouse Suite",
          price: 5500,
          location: "890 Skyline Ave, Downtown",
          type: "apartment",
          bedrooms: 2,
          bathrooms: 2.5,
          area: 2000,
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
          features: ["Rooftop Terrace", "Smart Home", "Private Elevator"],
          description:
            "Luxurious penthouse with stunning city views and premium amenities.",
        },
        {
          id: 7,
          title: "Garden View Apartment",
          price: 2800,
          location: "234 Garden St, Parkside",
          type: "apartment",
          bedrooms: 2,
          bathrooms: 2,
          area: 1100,
          image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          features: ["Garden View", "Balcony", "Storage"],
          description:
            "Peaceful apartment with beautiful garden views and modern amenities.",
        },
        {
          id: 8,
          title: "Modern Loft",
          price: 4200,
          location: "567 Industrial Ave, Arts District",
          type: "loft",
          bedrooms: 1,
          bathrooms: 1.5,
          area: 1400,
          image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
          features: ["High Ceilings", "Exposed Brick", "Artist Studio"],
          description:
            "Spacious loft with industrial charm and artistic character.",
        },
        {
          id: 9,
          title: "Family Townhouse",
          price: 3900,
          location: "789 Family Lane, Suburbs",
          type: "townhouse",
          bedrooms: 3,
          bathrooms: 2.5,
          area: 1800,
          image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          features: ["Playground", "Community Pool", "Garage"],
          description:
            "Family-friendly townhouse in a quiet suburban neighborhood.",
        },
        {
          id: 10,
          title: "Luxury Penthouse",
          price: 6500,
          location: "123 Skyline Blvd, Downtown",
          type: "apartment",
          bedrooms: 3,
          bathrooms: 3.5,
          area: 2200,
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
          features: ["360° Views", "Private Terrace", "Smart Home"],
          description: "Ultimate luxury penthouse with panoramic city views.",
        },
        // Add BnB
        {
          id: 11,
          title: "Charming BnB Retreat",
          price: 1800,
          location: "12 Beach Rd, Coastline",
          type: "bnb",
          bedrooms: 1,
          bathrooms: 1,
          area: 500,
          image: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
          features: ["Breakfast Included", "Near Beach"],
          description: "Cozy BnB perfect for a weekend getaway.",
        },
        // Add Commercial
        {
          id: 12,
          title: "Prime Office Space",
          price: 8000,
          location: "100 Business Park, CBD",
          type: "commercial",
          bedrooms: 0,
          bathrooms: 2,
          area: 5000,
          image: "https://images.unsplash.com/photo-1460518451285-97b6aa326961",
          features: ["Conference Room", "Parking"],
          description:
            "Modern office space in the heart of the business district.",
        },
        // Add Land
        {
          id: 13,
          title: "Development Land Plot",
          price: 120000,
          location: "Plot 45, Greenfields",
          type: "land",
          bedrooms: 0,
          bathrooms: 0,
          area: 20000,
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          features: ["Ready for Development"],
          description: "Large land plot ideal for development or investment.",
        },
        {
          id: 14,
          title: "Urban Studio Loft",
          price: 1700,
          location: "22 City Center, Urbania",
          type: "loft",
          bedrooms: 1,
          bathrooms: 1,
          area: 600,
          image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
          features: ["Open Floor Plan", "City View"],
          description: "Trendy studio loft in the heart of the city.",
        },
        {
          id: 15,
          title: "Country Cottage",
          price: 2100,
          location: "5 Maple Lane, Countryside",
          type: "house",
          bedrooms: 2,
          bathrooms: 1,
          area: 900,
          image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
          features: ["Fireplace", "Garden"],
          description: "Charming cottage with a beautiful garden.",
        },
        {
          id: 16,
          title: "Luxury City Condo",
          price: 5200,
          location: "88 Skyline Ave, Downtown",
          type: "condo",
          bedrooms: 3,
          bathrooms: 2,
          area: 1600,
          image: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c",
          features: ["Concierge", "Balcony"],
          description: "High-end condo with city views and luxury amenities.",
        },
        {
          id: 17,
          title: "Lakefront Bungalow",
          price: 3400,
          location: "77 Lakeview Dr, Lakeside",
          type: "house",
          bedrooms: 4,
          bathrooms: 3,
          area: 2200,
          image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e",
          features: ["Lake Access", "Deck"],
          description: "Spacious bungalow with direct lake access.",
        },
        {
          id: 18,
          title: "Downtown Micro-Apartment",
          price: 1200,
          location: "101 Main St, Downtown",
          type: "apartment",
          bedrooms: 1,
          bathrooms: 1,
          area: 350,
          image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99",
          features: ["Compact", "Central Location"],
          description: "Efficient micro-apartment for city living.",
        },
        {
          id: 19,
          title: "Mountain Retreat Cabin",
          price: 2600,
          location: "12 Pine Ridge, Mountains",
          type: "house",
          bedrooms: 3,
          bathrooms: 2,
          area: 1400,
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          features: ["Mountain View", "Fireplace"],
          description: "Cozy cabin with stunning mountain views.",
        },
        {
          id: 20,
          title: "Seaside Villa",
          price: 8000,
          location: "1 Ocean Blvd, Seaside",
          type: "house",
          bedrooms: 5,
          bathrooms: 4,
          area: 3500,
          image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
          features: ["Ocean View", "Pool"],
          description: "Luxury villa with private pool and ocean views.",
        },
        {
          id: 21,
          title: "Historic Townhouse",
          price: 3100,
          location: "33 Old Town Rd, Historic District",
          type: "townhouse",
          bedrooms: 3,
          bathrooms: 2,
          area: 1800,
          image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          features: ["Historic Charm", "Renovated"],
          description: "Beautifully renovated townhouse in a historic area.",
        },
        {
          id: 22,
          title: "Eco-Friendly Smart Home",
          price: 4300,
          location: "9 Greenway, Suburbs",
          type: "house",
          bedrooms: 4,
          bathrooms: 3,
          area: 2100,
          image: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
          features: ["Solar Panels", "Smart Home"],
          description: "Modern eco-friendly home with smart features.",
        },
        {
          id: 23,
          title: "City Center Penthouse",
          price: 9500,
          location: "200 High St, Downtown",
          type: "apartment",
          bedrooms: 4,
          bathrooms: 4,
          area: 3000,
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
          features: ["Rooftop Deck", "City View"],
          description: "Exclusive penthouse with panoramic city views.",
        },
        {
          id: 24,
          title: "Suburban Family Home",
          price: 3700,
          location: "45 Oakwood Dr, Suburbs",
          type: "house",
          bedrooms: 4,
          bathrooms: 2.5,
          area: 2000,
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
          features: ["Backyard", "Garage"],
          description: "Perfect family home in a quiet neighborhood.",
        },
        {
          id: 25,
          title: "Artist Loft",
          price: 2200,
          location: "17 Art St, Arts District",
          type: "loft",
          bedrooms: 1,
          bathrooms: 1,
          area: 900,
          image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
          features: ["Open Space", "Natural Light"],
          description: "Spacious loft perfect for artists and creatives.",
        },
        {
          id: 26,
          title: "Golf Course Condo",
          price: 3300,
          location: "88 Fairway Dr, Golf Estates",
          type: "condo",
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          image: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c",
          features: ["Golf View", "Balcony"],
          description: "Condo with views of the golf course.",
        },
        {
          id: 27,
          title: "Downtown Executive Suite",
          price: 6000,
          location: "300 Business Rd, Downtown",
          type: "apartment",
          bedrooms: 2,
          bathrooms: 2,
          area: 1500,
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
          features: ["Concierge", "Gym"],
          description: "Executive suite in the heart of the business district.",
        },
        {
          id: 28,
          title: "Tiny Home Retreat",
          price: 1100,
          location: "2 Forest Path, Outskirts",
          type: "house",
          bedrooms: 1,
          bathrooms: 1,
          area: 300,
          image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99",
          features: ["Minimalist", "Nature"],
          description: "Tiny home surrounded by nature.",
        },
        {
          id: 29,
          title: "Luxury BnB Suite",
          price: 2700,
          location: "55 Beachside, Coastline",
          type: "bnb",
          bedrooms: 2,
          bathrooms: 2,
          area: 800,
          image: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
          features: ["Breakfast Included", "Ocean View"],
          description: "Luxury BnB suite with ocean views.",
        },
        {
          id: 30,
          title: "Modern Suburban Duplex",
          price: 3200,
          location: "60 Twin Oaks, Suburbs",
          type: "house",
          bedrooms: 3,
          bathrooms: 2,
          area: 1600,
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
          features: ["Garage", "Yard"],
          description: "Modern duplex in a family-friendly neighborhood.",
        },
      ].map((property) => ({
        ...property,
        isBookmarked: bookmarkedProperties.includes(property.id),
      })),
    [bookmarkedProperties]
  );

  // Memoize filteredProperties
  const filteredProperties = useMemo(
    () =>
      properties.filter((property) => {
        const matchesSearch =
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice =
          (!priceRange.min || property.price >= priceRange.min) &&
          (!priceRange.max || property.price <= priceRange.max);
        const matchesType =
          propertyType === "all" || property.type === propertyType;
        const matchesTransaction =
          transactionType === "all" ||
          (transactionType === "rent" &&
            ["apartment", "loft"].includes(property.type)) ||
          (transactionType === "sale" &&
            ["house", "condo", "townhouse", "land"].includes(property.type)) ||
          (transactionType === "lease" && property.type === "commercial");
        const matchesBedrooms =
          bedrooms === "any" || property.bedrooms >= parseInt(bedrooms);
        const matchesBathrooms =
          bathrooms === "any" || property.bathrooms >= parseInt(bathrooms);
        return (
          matchesSearch &&
          matchesPrice &&
          matchesType &&
          matchesTransaction &&
          matchesBedrooms &&
          matchesBathrooms
        );
      }),
    [
      properties,
      searchQuery,
      priceRange,
      propertyType,
      transactionType,
      bedrooms,
      bathrooms,
    ]
  );

  // Memoize tabFilteredProperties
  const tabFilteredProperties = useMemo(
    () =>
      activeTab === "all"
        ? filteredProperties
        : filteredProperties.filter((property) => {
            if (activeTab === "apartment") return property.type === "apartment";
            if (activeTab === "house")
              return property.type === "house" || property.type === "townhouse";
            if (activeTab === "bnb") return property.type === "bnb";
            if (activeTab === "commercial")
              return property.type === "commercial";
            if (activeTab === "land") return property.type === "land";
            return true;
          }),
    [filteredProperties, activeTab]
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, propertyType, bedrooms, bathrooms, activeTab]);

  // Pagination logic
  const totalPages = Math.ceil(
    tabFilteredProperties.length / PROPERTIES_PER_PAGE
  );
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * PROPERTIES_PER_PAGE;
    return tabFilteredProperties.slice(
      startIdx,
      startIdx + PROPERTIES_PER_PAGE
    );
  }, [tabFilteredProperties, currentPage, PROPERTIES_PER_PAGE]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Memoize handleBookmarkToggle
  const handleBookmarkToggle = useCallback((propertyId) => {
    setBookmarkedProperties((prev) => {
      const newBookmarks = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId];
      localStorage.setItem(
        "bookmarkedProperties",
        JSON.stringify(newBookmarks)
      );
      return newBookmarks;
    });
  }, []);

  // Property group tabs logic
  const propertyTabs = [
    { label: "All", value: "all" },
    { label: "Apartments", value: "apartment" },
    { label: "Houses/Homes", value: "house" },
    { label: "BnBs", value: "bnb" },
    { label: "Commercial", value: "commercial" },
    { label: "Land", value: "land" },
  ];

  const handleAddRole = async (role, closeModal) => {
    try {
      await authAPI.addRoleToCurrentUser(role); // You must implement this API call in your backend/frontend if not present
      closeModal();
    } catch (error) {
      alert("Failed to add role. Please try again.");
    }
  };

  const handleLandlordOnboarding = async () => {
    await handleAddRole("landlord", () => {
      setShowPropertyManagerModal(false);
      setLandlordStep(1);
      setLandlordId("");
      setLandlordProperty("");
    });
    const updatedUser = await authAPI.getCurrentUser();
    localStorage.setItem("user", JSON.stringify(updatedUser));
    router.push("/landlord");
  };

  const handleTenantOnboarding = async () => {
    await handleAddRole("tenant", () => {
      setShowTenantModal(false);
      setTenantStep(1);
      setTenantPolicyAccepted(false);
    });
    const updatedUser = await authAPI.getCurrentUser();
    localStorage.setItem("user", JSON.stringify(updatedUser));
    router.push("/tenant/dashboard");
  };

  const handlePropertyManagerClick = async () => {
    if (!isAuthenticated()) {
      router.push("/signin?role=landlord");
      return;
    }
    try {
      const user = await authAPI.getCurrentUser();
      if (user && user.roles && user.roles.includes("landlord")) {
        router.push("/landlord");
      } else {
        setShowPropertyManagerModal(true);
      }
    } catch {
      setShowPropertyManagerModal(true);
    }
  };

  const handleTenantClick = async () => {
    if (!isAuthenticated()) {
      router.push("/signin?role=tenant");
      return;
    }
    try {
      const user = await authAPI.getCurrentUser();
      if (user && user.roles && user.roles.includes("tenant")) {
        router.push("/tenant/dashboard");
      } else {
        setShowTenantModal(true);
      }
    } catch {
      setShowTenantModal(true);
    }
  };

  // Helper to generate windowed pagination with ellipsis
  function getPaginationPages(current, total) {
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (current > 4) pages.push("...");
    for (
      let i = Math.max(2, current - 2);
      i <= Math.min(total - 1, current + 2);
      i++
    ) {
      pages.push(i);
    }
    if (current < total - 3) pages.push("...");
    pages.push(total);
    return pages;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 font-[Inter,-apple-system,sans-serif]">
      <MarketplaceNav />

      {/* Stylish Hero Section with Blurred Background Image and Gradient Overlay - Extends Behind Nav */}
      <div className="relative overflow-hidden pt-0">
        {/* Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/hero-img2.jpg)",
            filter: "blur(3px)",
            transform: "scale(1.1)", // Slightly scale to avoid blur edge artifacts
          }}
        ></div>

        {/* Teal Brand Gradient Overlay on top of image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#009688]/70 via-[#00bcd4]/55 to-[#33bbaa]/65"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#009688]/35 to-transparent"></div>

        {/* Additional Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-300/15 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal-300/20 to-emerald-400/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
              Discover Your
              <span className="block bg-gradient-to-r from-white via-[#f0fdfa] to-[#ccfbf1] bg-clip-text text-transparent drop-shadow-2xl">
                Perfect Space
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-lg">
              Explore premium properties, find your dream home, or discover
              unique stays.
              <span className="block mt-2">Your next chapter starts here.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                href="/"
                className="group px-8 py-4 bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden border border-white/20"
              >
                <span className="relative z-10 drop-shadow-md">
                  Explore Properties
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00796b] to-[#26a69a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="#"
                onClick={handlePropertyManagerClick}
                className="px-8 py-4 bg-white/95 backdrop-blur-md text-[#009688] border-2 border-white/60 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-white hover:border-white transform hover:scale-105 transition-all duration-300"
              >
                For Property Managers
              </Link>
              <Link
                href="#"
                onClick={handleTenantClick}
                className="px-8 py-4 bg-white/95 backdrop-blur-md text-[#009688] border-2 border-white/60 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-white hover:border-white transform hover:scale-105 transition-all duration-300"
              >
                For Tenants
              </Link>
            </div>

            {/* List Property CTA */}
            <div className="animate-fade-in-up animation-delay-300">
              <Link
                href="/list-property"
                className="inline-flex items-center px-6 py-3 bg-white/98 backdrop-blur-md text-[#009688] rounded-xl font-bold text-base shadow-xl hover:shadow-2xl border-2 border-white/60 hover:border-white transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">+</span>
                List Your Property or Host a Space
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="relative z-20 -mt-8">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          bedrooms={bedrooms}
          setBedrooms={setBedrooms}
          bathrooms={bathrooms}
          setBathrooms={setBathrooms}
        />
      </div>

      {/* Property Group Tabs */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
            {propertyTabs.map((tab) => (
              <button
                key={tab.value}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer transform hover:scale-105 ${
                  activeTab === tab.value
                    ? "bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white shadow-md"
                    : "bg-white/70 text-[#009688] hover:bg-white hover:text-[#00796b] shadow-sm"
                }`}
                onClick={() => setActiveTab(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 animate-fade-in-up">
              {paginatedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button
                  className="flex items-center px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm text-[#009688] font-semibold shadow-md hover:shadow-lg hover:bg-white border border-gray-200/50 hover:border-[#009688]/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {getPaginationPages(currentPage, totalPages).map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={idx}
                      className="px-3 text-gray-400 select-none font-medium"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      className={`px-4 py-2 rounded-xl font-semibold shadow-md transition-all duration-300 transform hover:scale-105 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white shadow-lg"
                          : "bg-white/80 backdrop-blur-sm text-[#009688] hover:bg-white border border-gray-200/50 hover:border-[#009688]/30"
                      }`}
                      onClick={() => handlePageChange(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  className="flex items-center px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm text-[#009688] font-semibold shadow-md hover:shadow-lg hover:bg-white border border-gray-200/50 hover:border-[#009688]/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-200/50 max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-[#009688] mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                No properties found
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Try adjusting your search criteria or price range to find more
                properties.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modern Footer */}
      <footer className="mt-20 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#009688] to-[#33bbaa] bg-clip-text text-transparent text-2xl font-bold mb-4">
              edo Real Estate
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600 mb-6">
              <Link
                href="/"
                className="hover:text-[#009688] transition-colors duration-300 font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="hover:text-[#009688] transition-colors duration-300 font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-[#009688] transition-colors duration-300 font-medium"
              >
                Contact
              </Link>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} edo Real Estate. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Property Manager Onboarding Modal */}
      {showPropertyManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="relative bg-gradient-to-br from-white via-gray-50 to-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-200/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#009688] to-[#33bbaa] bg-clip-text text-transparent">
              Landlord Onboarding
            </h2>
            <div className="mb-8 flex flex-col items-center w-full">
              <div className="flex gap-2 mb-6">
                {[1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      landlordStep >= step
                        ? "bg-gradient-to-r from-[#009688] to-[#33bbaa] scale-110"
                        : "bg-gray-300"
                    }`}
                  ></span>
                ))}
              </div>
              {landlordStep === 1 && (
                <div className="w-full">
                  <p className="mb-4 font-medium text-gray-700 text-center">
                    Enter your ID to proceed:
                  </p>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] transition-all duration-300"
                    placeholder="Your ID"
                    value={landlordId}
                    onChange={(e) => setLandlordId(e.target.value)}
                  />
                </div>
              )}
              {landlordStep === 2 && (
                <div className="w-full">
                  <p className="mb-4 font-medium text-gray-700 text-center">
                    Add your first property:
                  </p>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] transition-all duration-300"
                    placeholder="Property Name/Address"
                    value={landlordProperty}
                    onChange={(e) => setLandlordProperty(e.target.value)}
                  />
                </div>
              )}
              {landlordStep === 3 && (
                <p className="font-medium text-gray-700 text-center">
                  Click below to complete onboarding and access your portal.
                </p>
              )}
            </div>
            {landlordStep < 3 ? (
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white rounded-xl font-semibold mb-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
                onClick={() => setLandlordStep(landlordStep + 1)}
                disabled={
                  (landlordStep === 1 && !landlordId) ||
                  (landlordStep === 2 && !landlordProperty)
                }
              >
                Next
              </button>
            ) : (
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white rounded-xl font-semibold mb-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={handleLandlordOnboarding}
              >
                Complete Onboarding
              </button>
            )}
            <button
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium border border-gray-200 hover:bg-gray-200 transition-all duration-300"
              onClick={() => {
                setShowPropertyManagerModal(false);
                setLandlordStep(1);
                setLandlordId("");
                setLandlordProperty("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Tenant Onboarding Modal */}
      {showTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="relative bg-gradient-to-br from-white via-gray-50 to-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-200/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#009688] to-[#33bbaa] bg-clip-text text-transparent">
              Tenant Onboarding
            </h2>
            <div className="mb-8 flex flex-col items-center w-full">
              <div className="flex gap-2 mb-6">
                {[1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      tenantStep >= step
                        ? "bg-gradient-to-r from-[#009688] to-[#33bbaa] scale-110"
                        : "bg-gray-300"
                    }`}
                  ></span>
                ))}
              </div>
              {tenantStep === 1 && (
                <p className="font-medium text-gray-700 text-center">
                  Confirm your information to proceed.
                </p>
              )}
              {tenantStep === 2 && (
                <div className="w-full flex flex-col items-center">
                  <p className="mb-4 font-medium text-gray-700 text-center">
                    Accept the rental policy and guidelines:
                  </p>
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                    <input
                      type="checkbox"
                      checked={tenantPolicyAccepted}
                      onChange={(e) =>
                        setTenantPolicyAccepted(e.target.checked)
                      }
                      className="w-5 h-5 text-[#009688] bg-gray-100 border-gray-300 rounded focus:ring-[#009688] focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      I accept the rental policy and guidelines.
                    </span>
                  </label>
                </div>
              )}
              {tenantStep === 3 && (
                <p className="font-medium text-gray-700 text-center">
                  Click below to complete onboarding and access your portal.
                </p>
              )}
            </div>
            {tenantStep < 3 ? (
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white rounded-xl font-semibold mb-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
                onClick={() => setTenantStep(tenantStep + 1)}
                disabled={tenantStep === 2 ? !tenantPolicyAccepted : false}
              >
                Next
              </button>
            ) : (
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white rounded-xl font-semibold mb-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={handleTenantOnboarding}
              >
                Complete Onboarding
              </button>
            )}
            <button
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium border border-gray-200 hover:bg-gray-200 transition-all duration-300"
              onClick={() => {
                setShowTenantModal(false);
                setTenantStep(1);
                setTenantPolicyAccepted(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceHome;
