import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LandlordSidebar from "../../../components/LandlordSidebar";

export default function LandlordNotices() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // general, vacate, eviction
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  // Mock data for notices
  const [notices] = useState([
    {
      id: "1",
      title: "Monthly Rent Reminder",
      type: "payment",
      date: "2024-07-01",
      audience: "All Tenants",
    },
    {
      id: "2",
      title: "Pool Maintenance",
      type: "maintenance",
      date: "2024-07-05",
      audience: "Building A",
    },
    {
      id: "3",
      title: "Lease Renewal",
      type: "lease",
      date: "2024-07-10",
      audience: "Unit B202",
    },
  ]);

  // Mock data for vacate requests
  const [vacateRequests] = useState([
    {
      id: "1",
      tenantName: "John Doe",
      property: "Sunset Apartments",
      unit: "A101",
      requestDate: "2024-06-28",
      moveOutDate: "2024-07-30",
      reason: "Relocating for work",
      status: "Pending",
    },
    {
      id: "2",
      tenantName: "Jane Smith",
      property: "Mountain View",
      unit: "B205",
      requestDate: "2024-06-25",
      moveOutDate: "2024-08-15",
      reason: "End of lease",
      status: "Approved",
    },
  ]);

  // Mock data for eviction notices
  const [evictionNotices] = useState([
    {
      id: "1",
      tenantName: "Robert Johnson",
      property: "Riverside Townhomes",
      unit: "C303",
      dateSent: "2024-06-20",
      reason: "Rent arrears for 3 months",
      moveOutDeadline: "2024-07-15",
      status: "Pending",
    },
  ]);

  // State for filtered data
  const [filteredNotices, setFilteredNotices] = useState(notices);
  const [filteredVacateRequests, setFilteredVacateRequests] =
    useState(vacateRequests);
  const [filteredEvictionNotices, setFilteredEvictionNotices] =
    useState(evictionNotices);

  // Filter and sort notices
  useEffect(() => {
    let result = [...notices];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (notice) =>
          notice.title.toLowerCase().includes(query) ||
          notice.audience.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((notice) => notice.type === typeFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOrder === "earliest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });

    setFilteredNotices(result);
  }, [searchQuery, typeFilter, sortOrder, notices]);

  // Filter and sort vacate requests
  useEffect(() => {
    let result = [...vacateRequests];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (request) =>
          request.tenantName.toLowerCase().includes(query) ||
          request.property.toLowerCase().includes(query) ||
          request.unit.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (request) => request.status.toLowerCase() === statusFilter
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === "latest") {
        return (
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
        );
      } else if (sortOrder === "earliest") {
        return (
          new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
        );
      }
      return 0;
    });

    setFilteredVacateRequests(result);
  }, [searchQuery, statusFilter, sortOrder, vacateRequests]);

  // Filter and sort eviction notices
  useEffect(() => {
    let result = [...evictionNotices];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (notice) =>
          notice.tenantName.toLowerCase().includes(query) ||
          notice.property.toLowerCase().includes(query) ||
          notice.unit.toLowerCase().includes(query)
      );
    }

    // Apply status filter (if we add status to eviction notices in the future)
    // For now, we'll just apply sorting

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime();
      } else if (sortOrder === "earliest") {
        return new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime();
      }
      return 0;
    });

    setFilteredEvictionNotices(result);
  }, [searchQuery, sortOrder, evictionNotices]);

  const navigateTo = (route: any) => {
    setSidebarOpen(false);
    router.push(route);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "payment":
        return { bg: "#dcfce7", text: "#166534" };
      case "maintenance":
        return { bg: "#fef9c3", text: "#854d0e" };
      case "lease":
        return { bg: "#dbeafe", text: "#1e40af" };
      case "general":
        return { bg: "#e5e7eb", text: "#374151" };
      default:
        return { bg: "#e5e7eb", text: "#374151" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { bg: "#fef9c3", text: "#854d0e" };
      case "approved":
        return { bg: "#dcfce7", text: "#166534" };
      case "declined":
        return { bg: "#fee2e2", text: "#991b1b" };
      case "acknowledged":
        return { bg: "#dbeafe", text: "#1e40af" };
      default:
        return { bg: "#e5e7eb", text: "#374151" };
    }
  };

  const renderNoticeItem = ({ item }: any) => (
    <View style={styles.compactCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor: getTypeColor(item.type).bg,
            },
          ]}
        >
          <Text
            style={[
              styles.typeBadgeText,
              { color: getTypeColor(item.type).text },
            ]}
          >
            {item.type}
          </Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={14} color="#666" />
          <Text style={styles.infoText}>{item.audience}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="create-outline" size={18} color="#009688" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVacateRequestItem = ({ item }: any) => (
    <View style={styles.compactCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.tenantName}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(item.status).bg,
            },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              { color: getStatusColor(item.status).text },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="home-outline" size={14} color="#666" />
          <Text style={styles.infoText}>
            {item.property} - {item.unit}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.infoText}>Req: {item.requestDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.infoText}>Move: {item.moveOutDate}</Text>
        </View>
      </View>
      {item.status === "Pending" && (
        <View style={styles.vacateActions}>
          <TouchableOpacity
            style={[styles.smallActionButton, { backgroundColor: "#10B981" }]}
            onPress={() => console.log("Approve request")}
          >
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallActionButton, { backgroundColor: "#EF4444" }]}
            onPress={() => console.log("Decline request")}
          >
            <Text style={styles.actionText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEvictionNoticeItem = ({ item }: any) => (
    <View style={styles.compactCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.tenantName}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="home-outline" size={14} color="#666" />
          <Text style={styles.infoText}>
            {item.property} - {item.unit}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.infoText}>Sent: {item.dateSent}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.infoText}>Due: {item.moveOutDeadline}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="create-outline" size={18} color="#009688" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Function to handle the + icon press
  const handleCreatePress = () => {
    if (activeTab === "general") {
      console.log("Create general notice");
    } else if (activeTab === "eviction") {
      console.log("Send eviction notice");
    }
    // For vacate tab, the + icon won't be shown
  };

  // Render filters based on active tab
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
          placeholder="Search..."
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
        <View style={styles.filterContent}>
          {activeTab === "general" && (
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Type:</Text>
              <View style={styles.filterOptions}>
                {["all", "payment", "maintenance", "lease"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterButton,
                      typeFilter === type && styles.activeFilterButton,
                    ]}
                    onPress={() => setTypeFilter(type)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        typeFilter === type && styles.activeFilterButtonText,
                      ]}
                    >
                      {type === "all"
                        ? "All"
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {activeTab === "vacate" && (
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.filterOptions}>
                {["all", "pending", "approved", "declined"].map((status) => (
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
                      {status === "all"
                        ? "All"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort:</Text>
            <View style={styles.filterOptions}>
              {["latest", "earliest"].map((order) => (
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
                    {order === "latest" ? "Latest" : "Earliest"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <LandlordSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRoute="/landlord/notices/page"
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu" size={24} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notices</Text>
        {/* Show + icon only for general and eviction tabs */}
        {activeTab !== "vacate" && (
          <TouchableOpacity onPress={handleCreatePress}>
            <Ionicons name="add" size={24} color="#009688" />
          </TouchableOpacity>
        )}
        {activeTab === "vacate" && <View style={{ width: 24 }} />}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "general" && styles.activeTab]}
          onPress={() => setActiveTab("general")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "general" && styles.activeTabText,
            ]}
          >
            General
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "vacate" && styles.activeTab]}
          onPress={() => setActiveTab("vacate")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "vacate" && styles.activeTabText,
            ]}
          >
            Vacate Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "eviction" && styles.activeTab]}
          onPress={() => setActiveTab("eviction")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "eviction" && styles.activeTabText,
            ]}
          >
            Eviction
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {activeTab === "general" && "General Notices"}
                {activeTab === "vacate" && "Vacate Requests"}
                {activeTab === "eviction" && "Eviction Notices"}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {activeTab === "general" && "Create and manage general notices"}
                {activeTab === "vacate" && "Review tenant vacate requests"}
                {activeTab === "eviction" && "Send and track eviction notices"}
              </Text>
            </View>
          </View>

          {/* Search and Filters */}
          {renderFilters()}

          {/* Content based on active tab */}
          {activeTab === "general" && (
            <FlatList
              data={filteredNotices}
              renderItem={renderNoticeItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons
                    name="document-text-outline"
                    size={48}
                    color="#ccc"
                  />
                  <Text style={styles.emptyStateTitle}>No Notices Found</Text>
                  <Text style={styles.emptyStateText}>
                    {searchQuery || typeFilter !== "all"
                      ? "No notices match your filters"
                      : "Create your first general notice to get started"}
                  </Text>
                </View>
              }
            />
          )}

          {activeTab === "vacate" && (
            <FlatList
              data={filteredVacateRequests}
              renderItem={renderVacateRequestItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="exit-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyStateTitle}>No Vacate Requests</Text>
                  <Text style={styles.emptyStateText}>
                    {searchQuery || statusFilter !== "all"
                      ? "No requests match your filters"
                      : "Vacate requests from tenants will appear here"}
                  </Text>
                </View>
              }
            />
          )}

          {activeTab === "eviction" && (
            <FlatList
              data={filteredEvictionNotices}
              renderItem={renderEvictionNoticeItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="warning-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyStateTitle}>
                    No Eviction Notices
                  </Text>
                  <Text style={styles.emptyStateText}>
                    {searchQuery
                      ? "No notices match your filters"
                      : "Eviction notices you send will appear here"}
                  </Text>
                </View>
              }
            />
          )}
        </View>
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
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#009688",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#009688",
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    marginBottom: 16,
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
  filtersContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
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
  filterContent: {
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
  listContainer: {
    paddingBottom: 16,
  },
  compactCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardContent: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconButton: {
    padding: 6,
    marginLeft: 10,
  },
  vacateActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  smallActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
