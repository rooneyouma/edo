import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

export default function LandlordProperties() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Downtown Apartment",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip_code: "10001",
      units: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
      ],
      type: "Apartment",
      description: "Modern downtown apartment complex with great amenities",
    },
    {
      id: 2,
      name: "Suburban House",
      street: "456 Oak Ave",
      city: "Brooklyn",
      state: "NY",
      zip_code: "11201",
      units: [{ id: 1 }],
      type: "House",
      description: "Beautiful family home in quiet neighborhood",
    },
    {
      id: 3,
      name: "Waterfront Condo",
      street: "789 Harbor Blvd",
      city: "Jersey City",
      state: "NJ",
      zip_code: "07302",
      units: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
      ],
      type: "Condominium",
      description: "Luxury waterfront condos with stunning views",
    },
  ]);

  // Filter properties based on search and type
  const filteredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    return properties.filter((property) => {
      // Search filter
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        !search ||
        property.name.toLowerCase().includes(search) ||
        property.street.toLowerCase().includes(search) ||
        property.city.toLowerCase().includes(search) ||
        property.state.toLowerCase().includes(search) ||
        property.type.toLowerCase().includes(search);

      // Type filter
      const matchesType =
        typeFilter === "all" ||
        property.type.toLowerCase().includes(typeFilter.toLowerCase());

      return matchesSearch && matchesType;
    });
  }, [properties, searchQuery, typeFilter]);

  // Get unique property types for filter dropdown
  const propertyTypes = useMemo(() => {
    const types = properties.map((p) => p.type);
    return ["all", ...Array.from(new Set(types))];
  }, [properties]);

  // Sidebar menu items
  const menuItems = [
    { label: "Dashboard", icon: "grid-outline", route: "/landlord/page" },
    {
      label: "Properties",
      icon: "home",
      route: "/landlord/properties/page",
    },
    {
      label: "Tenants",
      icon: "people",
      route: "/landlord/tenants/page",
    },
    {
      label: "Maintenance",
      icon: "construct",
      route: "/landlord/maintenance/page",
    },
    {
      label: "Payments",
      icon: "cash",
      route: "/landlord/payments/page",
    },
    {
      label: "Notices",
      icon: "document-text",
      route: "/landlord/notices/page",
    },
    { label: "Settings", icon: "settings", route: "/settings/page" },
  ];

  const navigateTo = (route: any) => {
    setSidebarOpen(false);
    router.push(route);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Sidebar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarOpen}
        onRequestClose={() => setSidebarOpen(false)}
      >
        <TouchableOpacity
          style={styles.sidebarOverlay}
          onPress={() => setSidebarOpen(false)}
          onLayout={() => {
            // Preserve navigation bar styling when modal is active
            NavigationBar.setButtonStyleAsync("dark");
          }}
        >
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Landlord Menu</Text>
              <TouchableOpacity onPress={() => setSidebarOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.sidebarContent}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.sidebarItem}
                  onPress={() => navigateTo(item.route)}
                >
                  <Ionicons name={item.icon as any} size={20} color="#009688" />
                  <Text style={styles.sidebarItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={styles.sidebarFooterItem}>
                <Ionicons name="log-out" size={20} color="#EF4444" />
                <Text style={styles.sidebarFooterText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu" size={24} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Properties</Text>
        <TouchableOpacity onPress={() => console.log("Add property")}>
          <Ionicons name="add" size={24} color="#009688" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Properties</Text>
            <Text style={styles.pageSubtitle}>
              Manage your properties and units
            </Text>
          </View>
        </View>

        {/* Combined Search and Filters */}
        <View style={styles.searchFiltersContainer}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#6b7280"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.filterHeader}
            onPress={() => setFiltersExpanded(!filtersExpanded)}
          >
            <Text style={styles.filterHeaderText}>Filters</Text>
            <Ionicons
              name={filtersExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#333"
            />
          </TouchableOpacity>

          {filtersExpanded && (
            <>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Property Type:</Text>
                <View style={styles.filterOptions}>
                  {propertyTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterChip,
                        typeFilter === type && styles.filterChipActive,
                      ]}
                      onPress={() => setTypeFilter(type)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          typeFilter === type && styles.filterChipTextActive,
                        ]}
                      >
                        {type === "all" ? "All Types" : type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {(searchQuery !== "" || typeFilter !== "all") && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                  }}
                >
                  <Text style={styles.clearFiltersText}>Clear filters</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Results Count */}
        <Text style={styles.resultsCount}>
          Showing {filteredProperties.length} of {properties.length} properties
        </Text>

        {/* No Results Message */}
        {filteredProperties.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="home-outline" size={48} color="#009688" />
            <Text style={styles.noResultsTitle}>No properties found</Text>
            <Text style={styles.noResultsText}>
              {searchQuery || typeFilter !== "all"
                ? "No properties match your search criteria."
                : "Get started by adding a new property."}
            </Text>
            {!searchQuery && typeFilter === "all" && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => console.log("Add property")}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addButtonText}>Add Property</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.propertiesGrid}>
            {filteredProperties.map((property) => (
              <TouchableOpacity
                key={property.id}
                style={styles.propertyCard}
                onPress={() => console.log(`View property ${property.id}`)}
              >
                <View style={styles.propertyHeader}>
                  <Text style={styles.propertyName} numberOfLines={1}>
                    {property.name}
                  </Text>
                  <Text style={styles.propertyType}>{property.type}</Text>
                </View>

                <Text style={styles.propertyAddress} numberOfLines={2}>
                  {`${property.street}, ${property.city}, ${property.state} ${property.zip_code}`}
                </Text>

                <Text style={styles.propertyDescription} numberOfLines={2}>
                  {property.description}
                </Text>

                <View style={styles.propertyStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {property.units?.length ?? 0}
                    </Text>
                    <Text style={styles.statLabel}>Units</Text>
                  </View>
                </View>

                <View style={styles.propertyActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      console.log(`Edit property ${property.id}`);
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color="#7C3AED" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      console.log(`Delete property ${property.id}`);
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#DC2626" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      console.log(`Manage units for property ${property.id}`);
                    }}
                  >
                    <Ionicons name="list-outline" size={20} color="#D97706" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      console.log(`Add tenant to property ${property.id}`);
                    }}
                  >
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color="#0891B2"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sidebar: {
    width: "80%",
    height: "100%",
    backgroundColor: "white",
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sidebarItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 20,
  },
  sidebarFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  sidebarFooterText: {
    fontSize: 16,
    color: "#EF4444",
    marginLeft: 15,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  searchFiltersContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 12,
  },
  filterHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  filterChipsContainer: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: "#009688",
  },
  filterChipText: {
    fontSize: 12,
    color: "#333",
  },
  filterChipTextActive: {
    color: "white",
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  clearFiltersButton: {
    alignSelf: "flex-start",
  },
  clearFiltersText: {
    color: "#009688",
    fontSize: 14,
    fontWeight: "500",
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#009688",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  propertiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  propertyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d9488",
    flex: 1,
    marginRight: 8,
  },
  propertyType: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  propertyAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  propertyDescription: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
    lineHeight: 18,
  },
  propertyStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  propertyActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 12,
  },
});
