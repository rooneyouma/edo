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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TenantSidebar from "../../../components/TenantSidebar";

// Define the maintenance request type
interface MaintenanceRequest {
  id: string;
  property_name: string;
  unit_number: string;
  subject: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Emergency";
  status: "Pending" | "In Progress" | "Completed";
  created_at: string;
  assigned_to_name?: string;
  assignee_phone?: string;
}

export default function TenantMaintenance() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  // Mock data for maintenance requests
  const maintenanceRequests: MaintenanceRequest[] = [
    {
      id: "1",
      property_name: "Sunset Apartments",
      unit_number: "Unit 4B",
      subject: "Leaky Faucet",
      description: "Kitchen faucet is leaking and needs repair",
      priority: "Medium",
      status: "In Progress",
      created_at: "2024-01-15T10:30:00Z",
      assigned_to_name: "John Plumbing",
      assignee_phone: "+1234567890",
    },
    {
      id: "2",
      property_name: "Sunset Apartments",
      unit_number: "Unit 4B",
      subject: "Air Conditioning",
      description: "AC unit not cooling properly",
      priority: "High",
      status: "Pending",
      created_at: "2024-01-10T14:20:00Z",
    },
    {
      id: "3",
      property_name: "Green Valley Villas",
      unit_number: "Villa 15",
      subject: "Broken Door Lock",
      description: "Front door lock is jammed and won't open",
      priority: "Emergency",
      status: "Completed",
      created_at: "2023-12-20T09:15:00Z",
      assigned_to_name: "Secure Locks Co.",
      assignee_phone: "+0987654321",
    },
  ];

  // State for filtered requests
  const [filteredRequests, setFilteredRequests] =
    useState<MaintenanceRequest[]>(maintenanceRequests);

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
          req.property_name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (req) => req.status.toLowerCase().replace(" ", "_") === statusFilter
      );
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(
        (req) => req.priority.toLowerCase() === priorityFilter
      );
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
        return (
          priorityOrder[b.priority.toLowerCase()] -
          priorityOrder[a.priority.toLowerCase()]
        );
      }
      return 0;
    });

    setFilteredRequests(result);
  }, [searchQuery, statusFilter, priorityFilter, sortOrder]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "emergency":
        return "#EF4444"; // red
      case "high":
        return "#F59E0B"; // amber
      case "medium":
        return "#009688"; // teal
      case "low":
        return "#6B7280"; // gray
      default:
        return "#6B7280"; // gray
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#F59E0B"; // amber
      case "in progress":
        return "#3B82F6"; // blue
      case "completed":
        return "#10B981"; // green
      default:
        return "#6B7280"; // gray
    }
  };

  // Get priority text style
  const getPriorityTextStyle = (priority: string) => {
    return {
      color: getPriorityColor(priority),
      backgroundColor: `${getPriorityColor(priority)}20`,
      ...styles.statusBadge,
    };
  };

  // Get status text style
  const getStatusTextStyle = (status: string) => {
    return {
      color: getStatusColor(status),
      backgroundColor: `${getStatusColor(status)}20`,
      ...styles.statusBadge,
    };
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Tenant Sidebar */}
      <TenantSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRoute="/tenant/maintenance/page"
      />

      {/* Request Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedRequest}
        onRequestClose={() => setSelectedRequest(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedRequest?.subject}
              </Text>
              <TouchableOpacity onPress={() => setSelectedRequest(null)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedRequest && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Request Details</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Property</Text>
                      <Text style={styles.infoValue}>
                        {selectedRequest.property_name}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Unit</Text>
                      <Text style={styles.infoValue}>
                        {selectedRequest.unit_number}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Submitted</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(selectedRequest.created_at)}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Priority</Text>
                      <Text
                        style={getPriorityTextStyle(selectedRequest.priority)}
                      >
                        {selectedRequest.priority}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Status</Text>
                      <Text style={getStatusTextStyle(selectedRequest.status)}>
                        {selectedRequest.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                      {selectedRequest.description}
                    </Text>
                  </View>

                  {selectedRequest.assigned_to_name && (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Assigned To</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Name</Text>
                        <Text style={styles.infoValue}>
                          {selectedRequest.assigned_to_name}
                        </Text>
                      </View>
                      {selectedRequest.assignee_phone && (
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Phone</Text>
                          <Text style={styles.infoValue}>
                            {selectedRequest.assignee_phone}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedRequest(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Request Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewRequestModal}
        onRequestClose={() => setShowNewRequestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Maintenance Request</Text>
              <TouchableOpacity onPress={() => setShowNewRequestModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.placeholderText}>
                New maintenance request form would be implemented here. This
                would include fields for:
              </Text>
              <Text style={styles.placeholderText}>• Subject</Text>
              <Text style={styles.placeholderText}>• Description</Text>
              <Text style={styles.placeholderText}>• Priority selection</Text>
              <Text style={styles.placeholderText}>• Image attachments</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowNewRequestModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={() => {
                    setShowNewRequestModal(false);
                    Alert.alert("Success", "Maintenance request submitted!");
                  }}
                >
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowNewRequestModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu" size={24} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maintenance</Text>
        <TouchableOpacity onPress={() => setShowNewRequestModal(true)}>
          <Ionicons name="add" size={24} color="#009688" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
        }}
      >
        <Text style={styles.pageTitle}>Maintenance Requests</Text>
        <Text style={styles.pageSubtitle}>
          Submit and track maintenance requests for your rental property
        </Text>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons name="document-text-outline" size={24} color="#009688" />
            <Text style={styles.summaryValue}>
              {maintenanceRequests.length}
            </Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="time-outline" size={24} color="#F59E0B" />
            <Text style={styles.summaryValue}>
              {maintenanceRequests.filter((r) => r.status === "Pending").length}
            </Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="construct-outline" size={24} color="#3B82F6" />
            <Text style={styles.summaryValue}>
              {
                maintenanceRequests.filter((r) => r.status === "In Progress")
                  .length
              }
            </Text>
            <Text style={styles.summaryLabel}>In Progress</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#10B981"
            />
            <Text style={styles.summaryValue}>
              {
                maintenanceRequests.filter((r) => r.status === "Completed")
                  .length
              }
            </Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
        </View>

        {/* Search and Filters */}
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
            <View style={styles.filterContent}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Status:</Text>
                <View style={styles.filterOptions}>
                  {["all", "pending", "in_progress", "completed"].map(
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
                  {["all", "low", "medium", "high", "emergency"].map(
                    (priority) => (
                      <TouchableOpacity
                        key={priority}
                        style={[
                          styles.filterButton,
                          priorityFilter === priority &&
                            styles.activeFilterButton,
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
                            : priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
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

        {/* Maintenance Requests List */}
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="build-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No Maintenance Requests</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "No requests match your filters"
                : "You don't have any maintenance requests yet."}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowNewRequestModal(true)}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addButtonText}>Create Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.requestsContainer}>
            {filteredRequests.map((request) => (
              <TouchableOpacity
                key={request.id}
                style={styles.requestCard}
                onPress={() => setSelectedRequest(request)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.subject} numberOfLines={1}>
                    {request.subject}
                  </Text>
                  <Text style={getPriorityTextStyle(request.priority)}>
                    {request.priority}
                  </Text>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                  {request.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.propertyInfo}>
                    {request.property_name} • {request.unit_number}
                  </Text>
                  <Text style={getStatusTextStyle(request.status)}>
                    {request.status}
                  </Text>
                </View>

                <Text style={styles.dateText}>
                  Submitted: {formatDate(request.created_at)}
                </Text>
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
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 16,
    lineHeight: 18,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginHorizontal: -4,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688",
    marginBottom: 4,
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
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
    marginBottom: 24,
    lineHeight: 20,
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
  requestsContainer: {
    paddingVertical: 8,
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  subject: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#009688",
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  propertyInfo: {
    fontSize: 11,
    color: "#999",
  },
  dateText: {
    fontSize: 11,
    color: "#999",
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: "hidden",
    textAlign: "center",
    minWidth: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
    maxHeight: "80%",
  },
  modalView: {
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#009688",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
