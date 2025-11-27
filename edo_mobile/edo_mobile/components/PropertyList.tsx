import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  DeviceEventEmitter,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import PropertyCard from "./PropertyCard";
import PropertyPagination from "./PropertyPagination";

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

interface PropertyListProps {
  properties: Property[];
  itemsPerPage?: number;
  onBookmarkToggle?: (propertyId: number) => void; // Optional callback for bookmark changes
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  itemsPerPage = 12, // Match web app's PROPERTIES_PER_PAGE = 12
  onBookmarkToggle,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedProperties, setBookmarkedProperties] = useState<number[]>(
    []
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

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

  // Update bookmarked properties when the properties prop changes
  useEffect(() => {
    setBookmarkedProperties(
      properties.filter((p) => p.isBookmarked).map((p) => p.id)
    );
  }, [properties]);

  // Calculate pagination
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = properties.slice(startIndex, endIndex);

  const handleBookmarkToggle = (propertyId: number) => {
    setBookmarkedProperties((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });

    // Call the parent callback if provided
    if (onBookmarkToggle) {
      onBookmarkToggle(propertyId);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when changing pages
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  };

  // Handle scroll events to show/hide scroll to top button
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Show scroll to top button when scrolled down 200 pixels
    setShowScrollTop(offsetY > 200);
  };

  // Scroll to top function
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderProperty = ({ item }: { item: Property }) => {
    const updatedProperty = {
      ...item,
      isBookmarked: bookmarkedProperties.includes(item.id),
    };

    return (
      <View style={styles.propertyItem}>
        <PropertyCard
          property={updatedProperty}
          onBookmarkToggle={handleBookmarkToggle}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {paginatedProperties.length > 0 ? (
        <>
          <FlatList
            ref={flatListRef}
            data={paginatedProperties}
            renderItem={renderProperty}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
          {totalPages > 1 && (
            <PropertyPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="home-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Properties Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try adjusting your search or filter criteria
          </Text>
        </View>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={scrollToTop}
          accessibilityLabel="Scroll to top"
        >
          <Ionicons name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  propertyItem: {
    flex: 0.48,
    marginBottom: 16,
  },
  scrollTopButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#009688",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
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

export default PropertyList;
