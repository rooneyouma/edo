import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";
import MarketplaceHeader from "../components/MarketplaceHeader";
import SearchFilters from "../components/SearchFilters";
import PropertyTabs from "../components/PropertyTabs";
import PropertyList from "../components/PropertyList";

export default function MarketplaceHome() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [propertyType, setPropertyType] = useState("all");
  const [transactionType, setTransactionType] = useState("all");
  const [bedrooms, setBedrooms] = useState("any");
  const [bathrooms, setBathrooms] = useState("any");
  const [activeTab, setActiveTab] = useState("all");
  const [bookmarkedProperties, setBookmarkedProperties] = useState<number[]>(
    []
  );
  const [properties, setProperties] = useState([
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
      isBookmarked: false,
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
      isBookmarked: true,
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
      isBookmarked: false,
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
      isBookmarked: false,
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
      isBookmarked: false,
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
      isBookmarked: false,
    },
    {
      id: 7,
      title: "Charming Bungalow",
      price: 3500,
      location: "234 Elm St, Historic District",
      type: "house",
      bedrooms: 3,
      bathrooms: 2,
      area: 1400,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      features: ["Hardwood Floors", "Garden", "Porch"],
      description:
        "Charming bungalow with original details and a beautiful garden.",
      isBookmarked: false,
    },
    {
      id: 8,
      title: "Modern Loft",
      price: 2800,
      location: "567 Industrial Ave, Arts District",
      type: "loft",
      bedrooms: 1,
      bathrooms: 1,
      area: 900,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      features: ["High Ceilings", "Exposed Brick", "City Views"],
      description: "Stylish loft with industrial elements and downtown views.",
      isBookmarked: false,
    },
    {
      id: 9,
      title: "Suburban Ranch",
      price: 4200,
      location: "890 Country Lane, Suburbs",
      type: "house",
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      features: ["Large Yard", "Garage", "Basement"],
      description:
        "Spacious ranch-style home with a large yard and modern updates.",
      isBookmarked: false,
    },
    {
      id: 10,
      title: "Downtown Studio",
      price: 1800,
      location: "123 High St, Downtown",
      type: "apartment",
      bedrooms: 0,
      bathrooms: 1,
      area: 450,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      features: ["Furnished", "Gym", "Rooftop Access"],
      description: "Fully furnished studio in a prime downtown location.",
      isBookmarked: false,
    },
    {
      id: 11,
      title: "Luxury Penthouse",
      price: 6500,
      location: "456 Sky Tower, Downtown",
      type: "apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: 2500,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      features: ["Private Elevator", "Terrace", "Concierge"],
      description:
        "Exclusive penthouse with panoramic city views and premium amenities.",
      isBookmarked: false,
    },
    {
      id: 12,
      title: "Coastal Cottage",
      price: 3800,
      location: "789 Beach Rd, Coastal Area",
      type: "house",
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      features: ["Ocean Views", "Deck", "Beach Access"],
      description:
        "Charming cottage just steps from the beach with stunning ocean views.",
      isBookmarked: false,
    },
    {
      id: 13,
      title: "Urban Townhouse",
      price: 3600,
      location: "345 City Center, Metro Area",
      type: "townhouse",
      bedrooms: 3,
      bathrooms: 2,
      area: 1700,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      features: ["Roof Deck", "Parking", "Modern Kitchen"],
      description:
        "Sleek townhouse in the heart of the city with contemporary finishes.",
      isBookmarked: false,
    },
    {
      id: 14,
      title: "Mountain View Cabin",
      price: 2900,
      location: "678 Forest Rd, Mountain Region",
      type: "house",
      bedrooms: 2,
      bathrooms: 1,
      area: 950,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      features: ["Fireplace", "Deck", "Mountain Views"],
      description:
        "Cozy cabin with breathtaking mountain views and peaceful surroundings.",
      isBookmarked: false,
    },
    {
      id: 15,
      title: "Luxury Condo",
      price: 4200,
      location: "901 Elite Blvd, Uptown",
      type: "condo",
      bedrooms: 2,
      bathrooms: 2,
      area: 1300,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      features: ["Concierge", "Gym", "Pool"],
      description:
        "High-end condo with premium amenities and city skyline views.",
      isBookmarked: false,
    },
    {
      id: 16,
      title: "Historic Victorian",
      price: 5800,
      location: "234 Heritage St, Old Town",
      type: "house",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      features: ["Original Details", "Garden", "Wraparound Porch"],
      description:
        "Beautifully restored Victorian with period details and modern updates.",
      isBookmarked: false,
    },
    {
      id: 17,
      title: "Modern Apartment",
      price: 2100,
      location: "567 Contemporary Ave, New District",
      type: "apartment",
      bedrooms: 1,
      bathrooms: 1,
      area: 750,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      features: ["Smart Home", "Balcony", "Gym"],
      description:
        "Contemporary apartment with smart technology and city views.",
      isBookmarked: false,
    },
    {
      id: 18,
      title: "Lakeside Retreat",
      price: 4500,
      location: "890 Lakeview Dr, Lakeside",
      type: "house",
      bedrooms: 3,
      bathrooms: 2,
      area: 2100,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      features: ["Dock", "Fire Pit", "Water Views"],
      description:
        "Stunning home on the lake with private dock and panoramic water views.",
      isBookmarked: false,
    },
    {
      id: 19,
      title: "City Studio",
      price: 1600,
      location: "123 Urban St, City Center",
      type: "apartment",
      bedrooms: 0,
      bathrooms: 1,
      area: 500,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      features: ["Furnished", "Rooftop", "Concierge"],
      description:
        "Compact studio in a prime location with building amenities included.",
      isBookmarked: false,
    },
    {
      id: 20,
      title: "Suburban Estate",
      price: 6200,
      location: "456 Prestige Ln, Elite Suburbs",
      type: "house",
      bedrooms: 5,
      bathrooms: 4,
      area: 3500,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      features: ["Pool", "Garage", "Home Office"],
      description:
        "Luxurious estate with premium finishes and resort-style backyard.",
      isBookmarked: false,
    },
    {
      id: 21,
      title: "Downtown Loft",
      price: 3100,
      location: "789 Arts District, Downtown",
      type: "loft",
      bedrooms: 2,
      bathrooms: 1,
      area: 1200,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      features: ["Exposed Brick", "High Ceilings", "City Views"],
      description:
        "Converted industrial space with character and downtown skyline views.",
      isBookmarked: false,
    },
    {
      id: 22,
      title: "Beachfront Condo",
      price: 5200,
      location: "123 Ocean Dr, Beachfront",
      type: "condo",
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      features: ["Beach Access", "Balcony", "Pool"],
      description:
        "Stunning oceanfront condo with direct beach access and luxury amenities.",
      isBookmarked: false,
    },
    {
      id: 23,
      title: "Garden Apartment",
      price: 1900,
      location: "456 Green St, Garden District",
      type: "apartment",
      bedrooms: 1,
      bathrooms: 1,
      area: 800,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      features: ["Private Garden", "Parking", "Modern Kitchen"],
      description:
        "Charming apartment with private garden and peaceful neighborhood.",
      isBookmarked: false,
    },
    {
      id: 24,
      title: "Luxury Townhome",
      price: 4800,
      location: "789 Premium Ave, Upscale Area",
      type: "townhouse",
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      features: ["Roof Deck", "Garage", "Elevator"],
      description:
        "High-end townhome with premium finishes and private rooftop space.",
      isBookmarked: false,
    },
  ]);

  // Load bookmarked properties from AsyncStorage on component mount
  useEffect(() => {
    loadBookmarkedProperties();

    // Listen for bookmark changes from other components
    const handleBookmarkChange = () => {
      loadBookmarkedProperties();
    };

    // Add event listener for bookmark changes
    const subscription = DeviceEventEmitter.addListener(
      "bookmarkChange",
      handleBookmarkChange
    );

    // Cleanup listener on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  const loadBookmarkedProperties = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedProperties");
      if (savedBookmarks) {
        setBookmarkedProperties(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error("Error loading bookmarked properties:", error);
    }
  };

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search query filter (title, location, description)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          property.title.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Property type filter
      if (propertyType !== "all" && property.type !== propertyType) {
        return false;
      }

      // Bedrooms filter
      if (bedrooms !== "any") {
        const minBedrooms = parseInt(bedrooms);
        if (property.bedrooms < minBedrooms) {
          return false;
        }
      }

      // Bathrooms filter
      if (bathrooms !== "any") {
        const minBathrooms = parseInt(bathrooms);
        if (property.bathrooms < minBathrooms) {
          return false;
        }
      }

      // Active tab filter
      if (activeTab !== "all" && property.type !== activeTab) {
        return false;
      }

      return true;
    });
  }, [properties, searchQuery, propertyType, bedrooms, bathrooms, activeTab]);

  const handleBookmarkToggle = async (propertyId: number) => {
    try {
      // Update bookmarked properties in state
      const newBookmarks = bookmarkedProperties.includes(propertyId)
        ? bookmarkedProperties.filter((id) => id !== propertyId)
        : [...bookmarkedProperties, propertyId];

      setBookmarkedProperties(newBookmarks);

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "bookmarkedProperties",
        JSON.stringify(newBookmarks)
      );

      // Dispatch a custom event to notify other components of the change
      DeviceEventEmitter.emit("bookmarkChange");

      // Update the properties array to reflect the bookmark state
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? { ...property, isBookmarked: !property.isBookmarked }
            : property
        )
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MarketplaceHeader />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section with CTA Buttons */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Find Your Dream Space</Text>
          <Text style={styles.heroSubtitle}>
            Explore wonderful and unique spaces with edo
          </Text>

          {/* CTA Buttons */}
          <View style={styles.ctaButtonsContainer}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                To Property Management
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#009688"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                To Tenant Dashboard
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#009688"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </View>

          {/* List Property CTA */}
          <TouchableOpacity
            style={styles.listPropertyButton}
            onPress={() => router.push("/list-property/page")}
          >
            <Ionicons name="add" size={20} color="#009688" />
            <Text style={styles.listPropertyText}>
              List Your Property or Host a Space
            </Text>
          </TouchableOpacity>
        </View>

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

        <PropertyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <PropertyList
          properties={filteredProperties.map((p) => ({
            ...p,
            isBookmarked: bookmarkedProperties.includes(p.id),
          }))}
          itemsPerPage={12}
          onBookmarkToggle={handleBookmarkToggle}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heroSection: {
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#009688",
    borderRadius: 16,
    marginVertical: 16,
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 20,
  },
  ctaButtonsContainer: {
    flexDirection: "column",
    gap: 12,
    width: "100%",
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#009688",
    marginRight: 8,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#009688",
    marginRight: 8,
  },
  buttonIcon: {
    marginTop: 2,
  },
  listPropertyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  listPropertyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#009688",
    marginLeft: 8,
  },
});
