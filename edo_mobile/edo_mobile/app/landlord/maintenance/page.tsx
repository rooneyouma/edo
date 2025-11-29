import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types for our maintenance requests
interface MaintenanceRequest {
  id: number;
  subject: string;
  description: string;
  status: string;
  status_display: string;
  priority: string;
  priority_display: string;
  created_at: string;
  tenant_name: string;
  property_name: string;
  unit_number: string;
  assigned_to_name?: string;
  assignee_phone?: string;
}

export default function LandlordMaintenance() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState<
    MaintenanceRequest[]
  >([]);
  const [filteredRequests, setFilteredRequests] = useState<
    MaintenanceRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    unassigned: 0,
  });

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

  // Fetch maintenance requests
  const fetchMaintenanceRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        // No token - set empty state without showing error
        setMaintenanceRequests([]);
        setSummaryStats({ total: 0, pending: 0, assigned: 0, unassigned: 0 });
        setFilteredRequests([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/landlord/maintenance/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Only show error for actual HTTP errors, not empty results
        if (response.status === 404) {
          // No requests found - this is not an error
          setMaintenanceRequests([]);
          setSummaryStats({ total: 0, pending: 0, assigned: 0, unassigned: 0 });
          setFilteredRequests([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMaintenanceRequests(data);

      // Calculate summary stats
      const total = data.length;
      const pending = data.filter(
        (req: MaintenanceRequest) => req.status === "pending"
      ).length;
      const assigned = data.filter(
        (req: MaintenanceRequest) => req.assigned_to_name
      ).length;
      const unassigned = data.filter(
        (req: MaintenanceRequest) => !req.assigned_to_name
      ).length;

      setSummaryStats({ total, pending, assigned, unassigned });
      setFilteredRequests(data);
    } catch (error: unknown) {
      console.error("Error fetching maintenance requests:", error);
      // Only show alert for actual network errors
      if (
        error instanceof Error &&
        error.message !== "No authentication token found"
      ) {
        Alert.alert(
          "Error",
          "Failed to load maintenance requests. Please try again."
        );
      }
      // Set empty state on error
      setMaintenanceRequests([]);
      setSummaryStats({ total: 0, pending: 0, assigned: 0, unassigned: 0 });
      setFilteredRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh function
  const onRefresh = () => {
    setRefreshing(true);
    fetchMaintenanceRequests();
  };

  // Initial load
  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  // Check if user is authenticated
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem("access_token");
    return !!token;
  };

  // Filter and sort requests
  useEffect(() => {
    let result = [...maintenanceRequests];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (req) =>
          req.subject.toLowerCase().includes(query) ||
          req.description.toLowerCase().includes(query) ||
          req.tenant_name.toLowerCase().includes(query) ||
          req.property_name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((req) => req.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter((req) => req.priority === priorityFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === "latest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortOrder === "earliest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortOrder === "priority") {
        const priorityOrder: Record<string, number> = {
          emergency: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

    setFilteredRequests(result);
  }, [
    maintenanceRequests,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortOrder,
  ]);

  const navigateTo = (route: string) => {
    setSidebarOpen(false);
    router.push(route as any); // Cast to any to avoid TypeScript errors with dynamic routes
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { backgroundColor: "#fef3c7", textColor: "#92400e" };
      case "in_progress":
        return { backgroundColor: "#dbeafe", textColor: "#1e40af" };
      case "completed":
        return { backgroundColor: "#d1fae5", textColor: "#065f46" };
      case "cancelled":
        return { backgroundColor: "#fee2e2", textColor: "#b91c1c" };
      default:
        return { backgroundColor: "#f3f4f6", textColor: "#374151" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return { backgroundColor: "#d1fae5", textColor: "#065f46" };
      case "medium":
        return { backgroundColor: "#fef3c7", textColor: "#92400e" };
      case "high":
        return { backgroundColor: "#fed7aa", textColor: "#c2410c" };
      case "emergency":
        return { backgroundColor: "#fecaca", textColor: "#b91c1c" };
      default:
        return { backgroundColor: "#f3f4f6", textColor: "#374151" };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRequestPress = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedRequest(null);
  };

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: "#dbeafe" }]}>
          <Ionicons name="document-text" size={20} color="#3b82f6" />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryLabel}>Total Requests</Text>
          <Text style={styles.summaryValue}>{summaryStats.total}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: "#fef3c7" }]}>
          <Ionicons name="time" size={20} color="#f59e0b" />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={styles.summaryValue}>{summaryStats.pending}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: "#d1fae5" }]}>
          <Ionicons name="person" size={20} color="#10b981" />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryLabel}>Assigned</Text>
          <Text style={styles.summaryValue}>{summaryStats.assigned}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: "#fee2e2" }]}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryLabel}>Unassigned</Text>
          <Text style={styles.summaryValue}>{summaryStats.unassigned}</Text>
        </View>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#6b7280"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search requests..."
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
        <View style={styles.filterRow}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.filterOptions}>
              {["all", "pending", "in_progress", "completed", "cancelled"].map(
                (status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterButton,
                      statusFilter === status && styles.activeFilterButton,
                    ]}
                    onPress={() => setStatusFilter(status)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        statusFilter === status &&
                          styles.activeFilterButtonText,
                      ]}
                    >
                      {status === "all" ? "All" : status.replace("_", " ")}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Priority:</Text>
            <View style={styles.filterOptions}>
              {["all", "low", "medium", "high", "emergency"].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterButton,
                    priorityFilter === priority && styles.activeFilterButton,
                  ]}
                  onPress={() => setPriorityFilter(priority)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      priorityFilter === priority &&
                        styles.activeFilterButtonText,
                    ]}
                  >
                    {priority === "all"
                      ? "All"
                      : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort:</Text>
            <View style={styles.filterOptions}>
              {["latest", "earliest", "priority"].map((order) => (
                <TouchableOpacity
                  key={order}
                  style={[
                    styles.filterButton,
                    sortOrder === order && styles.activeFilterButton,
                  ]}
                  onPress={() => setSortOrder(order)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      sortOrder === order && styles.activeFilterButtonText,
                    ]}
                  >
                    {order === "latest"
                      ? "Latest"
                      : order === "earliest"
                      ? "Earliest"
                      : "Priority"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderRequestItem = ({ item }: { item: MaintenanceRequest }) => {
    const statusStyle = getStatusColor(item.status);
    const priorityStyle = getPriorityColor(item.priority);

    return (
      <TouchableOpacity
        style={styles.requestItem}
        onPress={() => handleRequestPress(item)}
      >
        <View style={styles.requestHeader}>
          <Text style={styles.requestSubject} numberOfLines={1}>
            {item.subject}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
              {item.status_display}
            </Text>
          </View>
        </View>

        <Text style={styles.requestDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.requestDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{item.tenant_name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="home" size={14} color="#6b7280" />
            <Text style={styles.detailText}>
              {item.property_name} • Unit {item.unit_number}
            </Text>
          </View>
        </View>

        <View style={styles.requestFooter}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: priorityStyle.backgroundColor },
            ]}
          >
            <Text
              style={[styles.priorityText, { color: priorityStyle.textColor }]}
            >
              {item.priority_display}
            </Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    if (!selectedRequest) return null;

    const statusStyle = getStatusColor(selectedRequest.status);
    const priorityStyle = getPriorityColor(selectedRequest.priority);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={closeDetailModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedRequest.subject}</Text>
              <TouchableOpacity onPress={closeDetailModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.modalSection}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.backgroundColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusStyle.textColor },
                      ]}
                    >
                      {selectedRequest.status_display}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Priority:</Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: priorityStyle.backgroundColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        { color: priorityStyle.textColor },
                      ]}
                    >
                      {selectedRequest.priority_display}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Submitted:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedRequest.created_at)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tenant:</Text>
                  <Text style={styles.detailValue}>
                    {selectedRequest.tenant_name}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Property:</Text>
                  <Text style={styles.detailValue}>
                    {selectedRequest.property_name} • Unit{" "}
                    {selectedRequest.unit_number}
                  </Text>
                </View>

                {selectedRequest.assigned_to_name && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Assigned To:</Text>
                    <Text style={styles.detailValue}>
                      {selectedRequest.assigned_to_name}
                    </Text>
                  </View>
                )}

                {selectedRequest.assignee_phone && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Contact:</Text>
                    <Text style={styles.detailValue}>
                      {selectedRequest.assignee_phone}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.descriptionSectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>
                  {selectedRequest.description}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeDetailModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderPlaceholder = () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="construct" size={48} color="#009688" />
      <Text style={styles.placeholderTitle}>No Maintenance Requests</Text>
      <Text style={styles.placeholderText}>
        {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
          ? "No requests match your filters"
          : "Maintenance requests from your tenants will appear here"}
      </Text>
    </View>
  );

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
              <TouchableOpacity
                style={styles.sidebarFooterItem}
                onPress={() => {
                  AsyncStorage.removeItem("access_token");
                  router.push("/auth/signin" as any); // Cast to any to avoid TypeScript errors
                }}
              >
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
        <Text style={styles.headerTitle}>Maintenance</Text>
        <TouchableOpacity onPress={fetchMaintenanceRequests}>
          <Ionicons name="refresh" size={24} color="#009688" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maintenance Requests</Text>
          <Text style={styles.sectionSubtitle}>
            Manage and track maintenance requests for your properties
          </Text>
        </View>

        {renderSummaryCards()}
        {renderFilters()}

        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="construct" size={48} color="#009688" />
            <Text style={styles.loadingText}>
              Loading maintenance requests...
            </Text>
          </View>
        ) : filteredRequests.length > 0 ? (
          <View style={styles.requestsList}>
            {filteredRequests.map((request) => (
              <View key={request.id}>
                {renderRequestItem({ item: request })}
              </View>
            ))}
          </View>
        ) : (
          renderPlaceholder()
        )}
      </ScrollView>

      {renderDetailModal()}
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
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  filtersContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
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
  filterRow: {
    marginBottom: 8,
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
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterButton: {
    backgroundColor: "#009688",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#333",
  },
  activeFilterButtonText: {
    color: "white",
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
  requestsList: {
    marginBottom: 16,
  },
  requestItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  requestSubject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  requestDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  requestDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  requestFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
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
    flex: 1,
    marginRight: 16,
  },
  modalBody: {
    padding: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  descriptionSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  modalActions: {
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
});
