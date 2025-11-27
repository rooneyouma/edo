import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// Mock property data - replace with actual API call
const getPropertyData = (id: string) => {
  // In a real app, this would be an API call
  return {
    id: parseInt(id),
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
      "Air Conditioning",
      "Washer/Dryer",
      "Dishwasher",
      "Balcony",
      "Hardwood Floors",
      "Walk-in Closet",
      "Central Heating",
      "High-Speed Internet",
      "Parking",
      "Gym",
      "Pool",
      "Security",
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
};

const PropertyDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (id) {
      // In a real app, you would fetch the property data from an API
      const propertyData = getPropertyData(id as string);
      setProperty(propertyData);
    }
  }, [id]);

  const handleContactLandlord = () => {
    Alert.alert("Contact Landlord", "This feature would open a contact form", [
      { text: "Cancel", style: "cancel" },
      { text: "Send Message" },
    ]);
  };

  const handleScheduleViewing = () => {
    Alert.alert(
      "Schedule Viewing",
      "This feature would open a scheduling form",
      [{ text: "Cancel", style: "cancel" }, { text: "Continue" }]
    );
  };

  const onChangeIndex = ({ index }: { index: number }) => {
    setCurrentImageIndex(index);
  };

  if (!property) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading property details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Back button only, removed heart and share icons */}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Image Gallery with Swipe Functionality */}
          <View style={[styles.imageGallery, { marginTop: insets.top + 50 }]}>
            <SwiperFlatList
              data={property.images}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.mainImage}
                  resizeMode="cover"
                />
              )}
              onChangeIndex={onChangeIndex}
              autoplay={false}
              showPagination={false}
              disableGesture={false}
            />

            {/* Image Indicator Dots */}
            <View style={styles.imageIndicator}>
              {property.images.map((_: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorDot,
                    index === currentImageIndex && styles.activeIndicatorDot,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Property Info */}
          <View style={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom, 80) }]}>
            <View style={styles.propertyHeader}>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color="#009688" />
                  <Text style={styles.locationText}>{property.location}</Text>
                </View>
              </View>

              <Text style={styles.propertyPrice}>
                ${property.price.toLocaleString()}
                {property.type === "apartment" || property.type === "loft" ? (
                  <Text style={styles.pricePeriod}>/mo</Text>
                ) : null}
              </Text>
            </View>

            {/* Key Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="bed-outline" size={20} color="#009688" />
                <Text style={styles.featureText}>{property.bedrooms} beds</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="water-outline" size={20} color="#009688" />
                <Text style={styles.featureText}>{property.bathrooms} baths</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="square-outline" size={20} color="#009688" />
                <Text style={styles.featureText}>
                  {property.area.toLocaleString()} sqft
                </Text>
              </View>
            </View>

            {/* Highlights */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Highlights</Text>
              <View style={styles.highlightsContainer}>
                {property.highlights.map((highlight: string, index: number) => (
                  <View key={index} style={styles.highlightItem}>
                    <View style={styles.highlightBullet} />
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{property.description}</Text>
            </View>

            {/* Amenities */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {property.amenities.map((amenity: string, index: number) => (
                  <View key={index} style={styles.amenityItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#009688" />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Extra padding to ensure content doesn't clash with footer */}
            <View style={{ height: 150 }} />
          </View>
        </ScrollView>
      </View>

      {/* Fixed Footer with Action Buttons - adjusted for safe area */}
      <View style={[styles.footerContainer, { paddingBottom: insets.bottom }]}>
        <View style={styles.footer}>
          {/* Landlord Info Card - separated from action buttons */}
          <View style={styles.landlordCard}>
            <View style={styles.landlordInfo}>
              <View style={styles.landlordAvatar}>
                <Ionicons name="person" size={20} color="#009688" />
              </View>
              <View style={styles.landlordDetails}>
                <Text style={styles.landlordName}>{property.landlord.name}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#ffd700" />
                  <Text style={styles.ratingText}>
                    {property.landlord.rating} ({property.landlord.reviews} reviews)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons - placed below the landlord info */}
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.contactButton]}
                onPress={handleContactLandlord}
              >
                <Ionicons name="mail-outline" size={20} color="#009688" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.scheduleButton]}
                onPress={handleScheduleViewing}
              >
                <Text style={styles.scheduleButtonText}>Schedule Viewing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  contentWrapper: {
    flex: 1,
    marginBottom: 80, // Reserve space for footer to prevent overlap
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // Minimal padding since footer covers bottom area
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    left: 16,
    zIndex: 100,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageGallery: {
    height: height * 0.4,
    position: "relative",
  },
  mainImage: {
    width: width,
    height: height * 0.4,
  },
  imageIndicator: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeIndicatorDot: {
    backgroundColor: "white",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  contentContainer: {
    padding: 16,
    marginTop: 16,
    // paddingBottom dynamically set based on safe area insets
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  propertyInfo: {
    flex: 1,
    marginRight: 16,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  propertyPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009688",
  },
  pricePeriod: {
    fontSize: 16,
    fontWeight: "normal",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  featureItem: {
    alignItems: "center",
  },
  featureText: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  highlightsContainer: {
    flexDirection: "column",
    gap: 8,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  highlightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#009688",
    marginTop: 8,
    marginRight: 12,
  },
  highlightText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  amenityText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // paddingBottom dynamically set based on safe area insets
  },

  footer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 0,
    borderRadius: 0,
  },

  landlordCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  landlordInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  landlordAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0f2f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  landlordDetails: {
    flex: 1,
  },
  landlordName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  actionButtonsContainer: {
    // Container for the action buttons
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
  },
  contactButton: {
    backgroundColor: "#e0f2f1",
    borderWidth: 1,
    borderColor: "#009688",
  },
  contactButtonText: {
    color: "#009688",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  scheduleButton: {
    backgroundColor: "#009688",
    flex: 2,
  },
  scheduleButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default PropertyDetailScreen;
