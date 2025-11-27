import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomSelect from "./CustomSelect";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  priceRange: { min: string; max: string };
  setPriceRange: (range: { min: string; max: string }) => void;
  propertyType: string;
  setPropertyType: (type: string) => void;
  transactionType: string;
  setTransactionType: (type: string) => void;
  bedrooms: string;
  setBedrooms: (bedrooms: string) => void;
  bathrooms: string;
  setBathrooms: (bathrooms: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  propertyType,
  setPropertyType,
  transactionType,
  setTransactionType,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
  };

  const handleTransactionTypeChange = (value: string) => {
    setTransactionType(value);
  };

  const handleBedroomsChange = (value: string) => {
    setBedrooms(value);
  };

  const handleBathroomsChange = (value: string) => {
    setBathrooms(value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <View style={styles.container}>
      {/* Floating Ceramic Tile Container */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color="#009688" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by location, property type, or keywords..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholderTextColor="#999"
            />
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={toggleFilters}
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive,
            ]}
            accessibilityLabel="Filter properties"
          >
            <Ionicons
              name="filter"
              size={20}
              color={showFilters ? "white" : "#009688"}
            />
            <Ionicons
              name={showFilters ? "chevron-up" : "chevron-down"}
              size={20}
              color={showFilters ? "white" : "#009688"}
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <View style={styles.filterPanel}>
            <View style={styles.filterGrid}>
              <View style={styles.filterColumn}>
                <Text style={styles.filterLabel}>Property Type</Text>
                <CustomSelect
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "apartment", label: "Apartment" },
                    { value: "house", label: "House" },
                    { value: "condo", label: "Condo" },
                    { value: "townhouse", label: "Townhouse" },
                  ]}
                  value={propertyType}
                  onChange={handlePropertyTypeChange}
                />
              </View>

              <View style={styles.filterColumn}>
                <Text style={styles.filterLabel}>Transaction Type</Text>
                <CustomSelect
                  options={[
                    { value: "all", label: "All Transactions" },
                    { value: "rent", label: "For Rent" },
                    { value: "sale", label: "For Sale" },
                    { value: "lease", label: "For Lease" },
                  ]}
                  value={transactionType}
                  onChange={handleTransactionTypeChange}
                />
              </View>

              <View style={styles.filterColumn}>
                <Text style={styles.filterLabel}>Bedrooms</Text>
                <CustomSelect
                  options={[
                    { value: "any", label: "Any" },
                    { value: "1", label: "1+" },
                    { value: "2", label: "2+" },
                    { value: "3", label: "3+" },
                    { value: "4", label: "4+" },
                    { value: "5", label: "5+" },
                  ]}
                  value={bedrooms}
                  onChange={handleBedroomsChange}
                />
              </View>

              <View style={styles.filterColumn}>
                <Text style={styles.filterLabel}>Bathrooms</Text>
                <CustomSelect
                  options={[
                    { value: "any", label: "Any" },
                    { value: "1", label: "1+" },
                    { value: "2", label: "2+" },
                    { value: "3", label: "3+" },
                    { value: "4", label: "4+" },
                  ]}
                  value={bathrooms}
                  onChange={handleBathroomsChange}
                />
              </View>
            </View>

            {/* Active Filter Tags */}
            <View style={styles.activeFiltersContainer}>
              {propertyType !== "all" && (
                <View style={styles.activeFilterTag}>
                  <Text style={styles.activeFilterText}>
                    {propertyType.charAt(0).toUpperCase() +
                      propertyType.slice(1)}
                  </Text>
                </View>
              )}
              {transactionType !== "all" && (
                <View style={styles.activeFilterTag}>
                  <Text style={styles.activeFilterText}>
                    {transactionType.charAt(0).toUpperCase() +
                      transactionType.slice(1)}
                  </Text>
                </View>
              )}
              {bedrooms !== "any" && (
                <View style={styles.activeFilterTag}>
                  <Text style={styles.activeFilterText}>
                    {bedrooms}+ Bedrooms
                  </Text>
                </View>
              )}
              {bathrooms !== "any" && (
                <View style={styles.activeFilterTag}>
                  <Text style={styles.activeFilterText}>
                    {bathrooms}+ Bathrooms
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  searchContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.3)",
    padding: 16,
  },
  searchRow: {
    flexDirection: "row",
    gap: 12,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 245, 245, 0.5)",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(0, 150, 136, 0.3)",
  },
  filterButtonActive: {
    backgroundColor: "#009688",
    borderColor: "#009688",
  },
  filterIcon: {
    marginLeft: 4,
  },
  filterPanel: {
    marginTop: 16,
    backgroundColor: "rgba(245, 245, 245, 0.5)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.3)",
  },
  filterGrid: {
    flexDirection: "column",
    gap: 12,
  },
  filterColumn: {
    width: "100%",
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  activeFilterTag: {
    backgroundColor: "#009688",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeFilterText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default SearchFilters;
