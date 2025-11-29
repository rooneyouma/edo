import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LandlordSidebar from "../../../components/LandlordSidebar";

// Define the Tenant type
type Tenant = {
  id: number;
  name: string;
  property: string;
  unit_number: string;
  phone: string;
  email: string;
  rent: number;
  status: string;
  leaseStart: string;
  leaseEnd: string;
};

export default function LandlordTenants() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for tenants
  const tenants: Tenant[] = [
    {
      id: 1,
      name: "John Smith",
      property: "Downtown Apartment",
      unit_number: "2B",
      phone: "(555) 123-4567",
      email: "john.smith@example.com",
      rent: 1200,
      status: "Active",
      leaseStart: "Jan 1, 2024",
      leaseEnd: "Dec 31, 2024",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      property: "Suburban House",
      unit_number: "Main Unit",
      phone: "(555) 987-6543",
      email: "sarah.j@example.com",
      rent: 1500,
      status: "Active",
      leaseStart: "Mar 1, 2024",
      leaseEnd: "Feb 28, 2025",
    },
    {
      id: 3,
      name: "Michael Brown",
      property: "Waterfront Condo",
      unit_number: "5A",
      phone: "(555) 456-7890",
      email: "michael.b@example.com",
      rent: 2200,
      status: "Pending",
      leaseStart: "Jun 1, 2024",
      leaseEnd: "May 31, 2025",
    },
    {
      id: 4,
      name: "Emily Davis",
      property: "Downtown Apartment",
      unit_number: "3A",
      phone: "(555) 111-2222",
      email: "emily.davis@example.com",
      rent: 1350,
      status: "Inactive",
      leaseStart: "Sep 1, 2023",
      leaseEnd: "Aug 31, 2024",
    },
    {
      id: 5,
      name: "Robert Wilson",
      property: "Suburban House",
      unit_number: "Basement",
      phone: "(555) 333-4444",
      email: "robert.wilson@example.com",
      rent: 1100,
      status: "Active",
      leaseStart: "Apr 1, 2024",
      leaseEnd: "Mar 31, 2025",
    },
    {
      id: 6,
      name: "Jennifer Lee",
      property: "Waterfront Condo",
      unit_number: "12C",
      phone: "(555) 555-6666",
      email: "jennifer.lee@example.com",
      rent: 2400,
      status: "Pending",
      leaseStart: "Jul 1, 2024",
      leaseEnd: "Jun 30, 2025",
    },
    {
      id: 7,
      name: "David Miller",
      property: "Downtown Apartment",
      unit_number: "4C",
      phone: "(555) 777-8888",
      email: "david.miller@example.com",
      rent: 1450,
      status: "Active",
      leaseStart: "May 1, 2024",
      leaseEnd: "Apr 30, 2025",
    },
    {
      id: 8,
      name: "Lisa Anderson",
      property: "Suburban House",
      unit_number: "Upstairs",
      phone: "(555) 999-0000",
      email: "lisa.anderson@example.com",
      rent: 1600,
      status: "Active",
      leaseStart: "Feb 1, 2024",
      leaseEnd: "Jan 31, 2025",
    },
    {
      id: 9,
      name: "James Taylor",
      property: "Waterfront Condo",
      unit_number: "8B",
      phone: "(555) 121-2121",
      email: "james.taylor@example.com",
      rent: 2100,
      status: "Pending",
      leaseStart: "Aug 1, 2024",
      leaseEnd: "Jul 31, 2025",
    },
    {
      id: 10,
      name: "Maria Garcia",
      property: "Downtown Apartment",
      unit_number: "1A",
      phone: "(555) 343-4343",
      email: "maria.garcia@example.com",
      rent: 1300,
      status: "Inactive",
      leaseStart: "Nov 1, 2023",
      leaseEnd: "Oct 31, 2024",
    },
    {
      id: 11,
      name: "Thomas Wilson",
      property: "Suburban House",
      unit_number: "Garage",
      phone: "(555) 565-6565",
      email: "thomas.wilson@example.com",
      rent: 900,
      status: "Active",
      leaseStart: "Jan 15, 2024",
      leaseEnd: "Jan 14, 2025",
    },
    {
      id: 12,
      name: "Karen Martinez",
      property: "Waterfront Condo",
      unit_number: "15D",
      phone: "(555) 787-8787",
      email: "karen.martinez@example.com",
      rent: 2500,
      status: "Active",
      leaseStart: "Sep 1, 2024",
      leaseEnd: "Aug 31, 2025",
    },
  ];

  // Filter tenants based on search and filters
  const filteredTenants = useMemo(() => {
    if (!tenants || tenants.length === 0) return [];

    return tenants.filter((tenant) => {
      // Search filter
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        !search ||
        tenant.name.toLowerCase().includes(search) ||
        tenant.property.toLowerCase().includes(search) ||
        tenant.unit_number.toLowerCase().includes(search);

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        tenant.status.toLowerCase().includes(statusFilter.toLowerCase());

      // Property filter
      const matchesProperty =
        propertyFilter === "all" ||
        tenant.property.toLowerCase().includes(propertyFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesProperty;
    });
  }, [tenants, searchQuery, statusFilter, propertyFilter]);

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTenants = filteredTenants.slice(startIndex, endIndex);

  // Get unique statuses for filter dropdown
  const statuses = useMemo(() => {
    const statusList = tenants.map((t) => t.status);
    return ["all", ...Array.from(new Set(statusList))];
  }, [tenants]);

  // Get unique properties for filter dropdown
  const properties = useMemo(() => {
    const propertyList = tenants.map((t) => t.property);
    return ["all", ...Array.from(new Set(propertyList))];
  }, [tenants]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return { backgroundColor: "#D1FAE5", color: "#047857" };
      case "Pending":
        return { backgroundColor: "#FEF3C7", color: "#92400E" };
      case "Inactive":
        return { backgroundColor: "#FEE2E2", color: "#B91C1C" };
      default:
        return { backgroundColor: "#F3F4F6", color: "#4B5563" };
    }
  };

  const openTenantModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setModalVisible(true);
  };

  const closeTenantModal = () => {
    setModalVisible(false);
    setSelectedTenant(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <LandlordSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRoute="/landlord/tenants/page"
      />

      {/* Tenant Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeTenantModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTenant?.name}</Text>
              <TouchableOpacity onPress={closeTenantModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedTenant && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Property</Text>
                    <Text style={styles.detailValue}>
                      {selectedTenant.property}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Unit</Text>
                    <Text style={styles.detailValue}>
                      {selectedTenant.unit_number}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone</Text>
                    <Text style={styles.detailValue}>
                      {selectedTenant.phone}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>
                      {selectedTenant.email}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Monthly Rent</Text>
                    <Text style={styles.detailValue}>
                      ${selectedTenant.rent}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(selectedTenant.status)
                            .backgroundColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: getStatusColor(selectedTenant.status).color,
                          },
                        ]}
                      >
                        {selectedTenant.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Lease Start</Text>
                    <Text style={styles.detailValue}>
                      {selectedTenant.leaseStart}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Lease End</Text>
                    <Text style={styles.detailValue}>
                      {selectedTenant.leaseEnd}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeTenantModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu" size={24} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tenants</Text>
        <TouchableOpacity onPress={() => console.log("Add tenant")}>
          <Ionicons name="add" size={24} color="#009688" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Tenants</Text>
        </View>

        {/* Search and Filters */}
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
              placeholder="Search tenants..."
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
                <Text style={styles.filterLabel}>Status:</Text>
                <View style={styles.filterOptions}>
                  {statuses.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.filterChip,
                        statusFilter === status && styles.filterChipActive,
                      ]}
                      onPress={() => setStatusFilter(status)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          statusFilter === status &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {status === "all" ? "All Status" : status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Property:</Text>
                <View style={styles.filterOptions}>
                  {properties.map((property) => (
                    <TouchableOpacity
                      key={property}
                      style={[
                        styles.filterChip,
                        propertyFilter === property && styles.filterChipActive,
                      ]}
                      onPress={() => setPropertyFilter(property)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          propertyFilter === property &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {property === "all" ? "All Properties" : property}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {(searchQuery !== "" ||
                statusFilter !== "all" ||
                propertyFilter !== "all") && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setPropertyFilter("all");
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
          Showing {startIndex + 1}-{Math.min(endIndex, filteredTenants.length)}{" "}
          of {filteredTenants.length} tenants
        </Text>

        {/* No Results Message */}
        {filteredTenants.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="people-outline" size={48} color="#009688" />
            <Text style={styles.noResultsTitle}>No tenants found</Text>
            <Text style={styles.noResultsText}>
              {searchQuery || statusFilter !== "all" || propertyFilter !== "all"
                ? "No tenants match your search criteria."
                : "Get started by adding a new tenant."}
            </Text>
            {!searchQuery &&
              statusFilter === "all" &&
              propertyFilter === "all" && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => console.log("Add tenant")}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.addButtonText}>Add Tenant</Text>
                </TouchableOpacity>
              )}
          </View>
        ) : (
          <>
            {/* Simplified Table */}
            {/* Replace with Cards */}
            <View style={styles.cardsContainer}>
              {currentTenants.map((tenant) => (
                <TouchableOpacity
                  key={tenant.id}
                  style={styles.tenantCard}
                  onPress={() => openTenantModal(tenant)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTenantName} numberOfLines={1}>
                      {tenant.name}
                    </Text>
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.cardRow}>
                      <Ionicons name="home" size={14} color="#009688" />
                      <Text style={styles.cardText} numberOfLines={1}>
                        {tenant.property}
                      </Text>
                    </View>

                    <View style={styles.cardRow}>
                      <Ionicons name="cube" size={14} color="#009688" />
                      <Text style={styles.cardText}>
                        Unit {tenant.unit_number}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pagination */}
            {totalPages > 1 && (
              <View
                style={[
                  styles.paginationContainer,
                  { paddingBottom: insets.bottom },
                ]}
              >
                <View style={styles.paginationInfo}>
                  <Text style={styles.paginationText}>
                    Page {currentPage} of {totalPages}
                  </Text>
                </View>

                <View style={styles.paginationControls}>
                  <TouchableOpacity
                    style={[
                      styles.pageButton,
                      currentPage === 1 && styles.disabledButton,
                    ]}
                    onPress={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={currentPage === 1 ? "#ccc" : "#009688"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.pageButton}
                    onPress={() => console.log("Go to page functionality")}
                  >
                    <Text style={styles.pageNumberText}>{currentPage}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.pageButton,
                      currentPage === totalPages && styles.disabledButton,
                    ]}
                    onPress={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={currentPage === totalPages ? "#ccc" : "#009688"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  closeButton: {
    backgroundColor: "#009688",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  pageHeader: {
    marginVertical: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  paginationInfo: {
    flex: 1,
  },
  paginationText: {
    fontSize: 14,
    color: "#666",
  },
  paginationControls: {
    flexDirection: "row",
    gap: 8,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#fafafa",
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#009688",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tenantCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTenantName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  cardContent: {
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  cardFooter: {
    alignItems: "flex-end",
  },
});
