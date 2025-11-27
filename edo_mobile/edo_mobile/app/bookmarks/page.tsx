import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";
import { useRouter } from "expo-router";
import PropertyList from "../../components/PropertyList";

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  features: string[];
  description: string;
  isBookmarked: boolean;
}

export default function BookmarksScreen() {
  const router = useRouter();
  const [bookmarkedProperties, setBookmarkedProperties] = useState<number[]>(
    []
  );
  const [properties, setProperties] = useState<Property[]>([]);

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
        const bookmarkedIds = JSON.parse(savedBookmarks);
        setBookmarkedProperties(bookmarkedIds);

        // Load the actual property data for bookmarked properties
        // In a real app, this would come from an API
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
            image:
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
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
            image:
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
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
            image:
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
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
            image:
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
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
            title: "Charming Bungalow",
            price: 3500,
            location: "234 Elm St, Historic District",
            type: "house",
            bedrooms: 3,
            bathrooms: 2,
            area: 1400,
            image:
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            features: ["Hardwood Floors", "Garden", "Porch"],
            description:
              "Charming bungalow with original details and a beautiful garden.",
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
            image:
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            features: ["High Ceilings", "Exposed Brick", "City Views"],
            description:
              "Stylish loft with industrial elements and downtown views.",
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
            image:
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
            features: ["Large Yard", "Garage", "Basement"],
            description:
              "Spacious ranch-style home with a large yard and modern updates.",
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
            image:
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            features: ["Furnished", "Gym", "Rooftop Access"],
            description: "Fully furnished studio in a prime downtown location.",
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
            image:
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            features: ["Ocean Views", "Deck", "Beach Access"],
            description:
              "Charming cottage just steps from the beach with stunning ocean views.",
          },
        ];

        const bookmarkedPropertiesData = mockProperties.filter((property) =>
          bookmarkedIds.includes(property.id)
        );

        // Add isBookmarked property to each property
        const propertiesWithBookmarkStatus = bookmarkedPropertiesData.map(
          (property) => ({
            ...property,
            isBookmarked: true,
          })
        );

        setProperties(propertiesWithBookmarkStatus);
      }
    } catch (error) {
      console.error("Error loading bookmarked properties:", error);
    }
  };

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

      // Update the properties list
      if (bookmarkedProperties.includes(propertyId)) {
        // Remove unbookmarked property
        setProperties((prev) =>
          prev.filter((property) => property.id !== propertyId)
        );
      } else {
        // Add newly bookmarked property
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
            image:
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
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
            image:
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
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
            image:
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
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
            image:
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
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
            title: "Charming Bungalow",
            price: 3500,
            location: "234 Elm St, Historic District",
            type: "house",
            bedrooms: 3,
            bathrooms: 2,
            area: 1400,
            image:
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            features: ["Hardwood Floors", "Garden", "Porch"],
            description:
              "Charming bungalow with original details and a beautiful garden.",
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
            image:
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            features: ["High Ceilings", "Exposed Brick", "City Views"],
            description:
              "Stylish loft with industrial elements and downtown views.",
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
            image:
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
            features: ["Large Yard", "Garage", "Basement"],
            description:
              "Spacious ranch-style home with a large yard and modern updates.",
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
            image:
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            features: ["Furnished", "Gym", "Rooftop Access"],
            description: "Fully furnished studio in a prime downtown location.",
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
            image:
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            features: ["Ocean Views", "Deck", "Beach Access"],
            description:
              "Charming cottage just steps from the beach with stunning ocean views.",
          },
        ];

        const bookmarkedProperty = mockProperties.find(
          (p) => p.id === propertyId
        );
        if (bookmarkedProperty) {
          setProperties((prev) => [
            ...prev,
            { ...bookmarkedProperty, isBookmarked: true },
          ]);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <StatusBar style="light" />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>My Bookmarks</Text>
            <Text style={styles.headerSubtitle}>
              {bookmarkedProperties.length} saved properties
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {properties.length > 0 ? (
          <PropertyList
            properties={properties}
            itemsPerPage={12}
            onBookmarkToggle={handleBookmarkToggle}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No bookmarks yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Save properties by tapping the bookmark icon
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    backgroundColor: "#009688",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
