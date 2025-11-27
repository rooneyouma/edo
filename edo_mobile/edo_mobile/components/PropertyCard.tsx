import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

interface PropertyCardProps {
  property: Property;
  onBookmarkToggle: (id: number) => void;
}

// Currency mapping for some common countries
const currencyMap: Record<string, { code: string; symbol: string }> = {
  KE: { code: "KES", symbol: "Ksh" },
  US: { code: "USD", symbol: "$" },
  GB: { code: "GBP", symbol: "£" },
  NG: { code: "NGN", symbol: "₦" },
  ZA: { code: "ZAR", symbol: "R" },
  EU: { code: "EUR", symbol: "€" },
};

const getUserCurrency = () => {
  // Default to US currency for mobile
  return currencyMap.US || { code: "USD", symbol: "$" };
};

const formatPrice = (price: number) => {
  const { symbol } = getUserCurrency();
  return `${symbol}${price.toLocaleString()}`;
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onBookmarkToggle,
}) => {
  const { id, title, price, location, image, isBookmarked, type } = property;

  const formattedPrice = formatPrice(price);

  // Property type status labels with colors
  const getStatusLabel = (type: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      apartment: { label: "For Rent", color: "#009688" },
      house: { label: "For Sale", color: "#009688" },
      townhouse: { label: "For Sale", color: "#009688" },
      condo: { label: "For Sale", color: "#009688" },
      bnb: {
        label: "BnB - Contact Only",
        color: "#00acc1",
      },
      commercial: { label: "For Lease", color: "#00838f" },
      land: { label: "For Sale", color: "#004d40" },
      loft: { label: "For Rent", color: "#009688" },
    };
    return (
      statusMap[type] || {
        label: "Available",
        color: "#009688",
      }
    );
  };

  const statusInfo = getStatusLabel(type);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.propertyImage}
          resizeMode="cover"
        />

        {/* Property Status Overlay */}
        <View
          style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}
        >
          <Text style={styles.statusText}>{statusInfo.label}</Text>
        </View>

        {/* Bookmark Button */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => onBookmarkToggle(id)}
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            color={isBookmarked ? "#009688" : "#ccc"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#009688" />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{formattedPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 4 / 3,
  },
  propertyImage: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  bookmarkButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    flex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688",
  },
});

export default PropertyCard;
