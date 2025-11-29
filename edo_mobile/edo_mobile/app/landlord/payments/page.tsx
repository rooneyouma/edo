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
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types for our payment data
interface Payment {
  id: number;
  tenant: string;
  property: string;
  unit: string;
  amount: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

export default function LandlordPayments() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [recordPaymentModalVisible, setRecordPaymentModalVisible] =
    useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

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

  // Mock data for payments (in a real app, this would come from an API)
  const mockPayments: Payment[] = [
    {
      id: 1,
      tenant: "John Doe",
      property: "Sunset Apartments",
      unit: "A101",
      amount: 1200,
      dueDate: "2024-03-01",
      status: "Paid",
      paymentDate: "2024-02-28",
      paymentMethod: "Credit Card",
    },
    {
      id: 2,
      tenant: "Jane Smith",
      property: "Mountain View Condos",
      unit: "B202",
      amount: 1500,
      dueDate: "2024-03-15",
      status: "Pending",
      paymentDate: null,
      paymentMethod: null,
    },
    {
      id: 3,
      tenant: "Bob Johnson",
      property: "Riverside Townhomes",
      unit: "C303",
      amount: 1800,
      dueDate: "2024-02-15",
      status: "Overdue",
      paymentDate: null,
      paymentMethod: null,
    },
    {
      id: 4,
      tenant: "Alice Brown",
      property: "Downtown Lofts",
      unit: "D404",
      amount: 2000,
      dueDate: "2024-03-10",
      status: "Paid",
      paymentDate: "2024-03-05",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 5,
      tenant: "Charlie Wilson",
      property: "Garden Villas",
      unit: "E505",
      amount: 1600,
      dueDate: "2024-03-20",
      status: "Paid",
      paymentDate: "2024-03-15",
      paymentMethod: "Credit Card",
    },
    {
      id: 6,
      tenant: "Emma Davis",
      property: "Sunset Apartments",
      unit: "A102",
      amount: 1400,
      dueDate: "2024-02-20",
      status: "Paid",
      paymentDate: "2024-02-15",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 7,
      tenant: "Michael Wilson",
      property: "Mountain View Condos",
      unit: "B203",
      amount: 1700,
      dueDate: "2024-03-25",
      status: "Pending",
      paymentDate: null,
      paymentMethod: null,
    },
    {
      id: 8,
      tenant: "Sarah Thompson",
      property: "Riverside Townhomes",
      unit: "C304",
      amount: 1900,
      dueDate: "2024-02-10",
      status: "Overdue",
      paymentDate: null,
      paymentMethod: null,
    },
    {
      id: 9,
      tenant: "David Miller",
      property: "Downtown Lofts",
      unit: "D505",
      amount: 2100,
      dueDate: "2024-03-30",
      status: "Pending",
      paymentDate: null,
      paymentMethod: null,
    },
  ];

  // Fetch payments (in a real app, this would be an API call)
  const fetchPayments = async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would fetch from your API:
      // const token = await AsyncStorage.getItem('access_token');
      // const response = await fetch('http://localhost:8000/api/v1/landlord/payments/', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();

      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      Alert.alert("Error", "Failed to load payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh function
  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  // Initial load
  useEffect(() => {
    fetchPayments();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Filter and sort payments
  useEffect(() => {
    let result = [...payments];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (payment) =>
          payment.tenant.toLowerCase().includes(query) ||
          payment.property.toLowerCase().includes(query) ||
          payment.unit.toLowerCase().includes(query) ||
          payment.paymentMethod?.toLowerCase().includes(query) ||
          payment.amount.toString().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((payment) => payment.status === statusFilter);
    }

    // Apply property filter
    if (propertyFilter !== "all") {
      result = result.filter((payment) => payment.property === propertyFilter);
    }

    // Apply payment method filter
    if (paymentMethodFilter !== "all") {
      result = result.filter(
        (payment) => payment.paymentMethod === paymentMethodFilter
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(
        a.status === "Paid" ? a.paymentDate || a.dueDate : a.dueDate
      );
      const dateB = new Date(
        b.status === "Paid" ? b.paymentDate || b.dueDate : b.dueDate
      );
      return sortOrder === "latest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    setFilteredPayments(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    payments,
    searchQuery,
    statusFilter,
    propertyFilter,
    paymentMethodFilter,
    sortOrder,
  ]);

  const navigateTo = (route: string) => {
    setSidebarOpen(false);
    router.push(route as any);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return { backgroundColor: "#d1fae5", textColor: "#065f46" };
      case "pending":
        return { backgroundColor: "#fef3c7", textColor: "#92400e" };
      case "overdue":
        return { backgroundColor: "#fee2e2", textColor: "#b91c1c" };
      default:
        return { backgroundColor: "#f3f4f6", textColor: "#374151" };
    }
  };

  const handlePaymentPress = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedPayment(null);
  };

  const closeRecordPaymentModal = () => {
    setRecordPaymentModalVisible(false);
  };

  const handleRecordPayment = (paymentData: any) => {
    // In a real app, you would send this data to your API
    console.log("Recording payment:", paymentData);
    Alert.alert("Success", "Payment recorded successfully");
    closeRecordPaymentModal();
    // Refresh payments
    fetchPayments();
  };

  // Calculate summary stats
  const summaryStats = {
    totalIncome: payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0),
    completedPayments: payments.filter((p) => p.status === "Paid").length,
    pendingPayments: payments.filter((p) => p.status === "Pending").length,
    overduePayments: payments.filter((p) => p.status === "Overdue").length,
  };

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: "#d1fae5" }]}>
          <Ionicons name="cash" size={20} color="#10b981" />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryValue}>
            ${summaryStats.totalIncome.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: "#dbeafe" }]}>
          <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryLabel}>Completed</Text>
          <Text style={styles.summaryValue}>
            {summaryStats.completedPayments}
          </Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: "#fef3c7" }]}>
          <Ionicons name="time" size={20} color="#f59e0b" />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={styles.summaryValue}>
            {summaryStats.pendingPayments}
          </Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: "#fee2e2" }]}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryLabel}>Overdue</Text>
          <Text style={styles.summaryValue}>
            {summaryStats.overduePayments}
          </Text>
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
          placeholder="Search payments..."
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
        <View style={styles.filterOptionsContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterChipsContainer}
            >
              {["all", "Paid", "Pending", "Overdue"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    statusFilter === status && styles.activeFilterChip,
                  ]}
                  onPress={() => setStatusFilter(status)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      statusFilter === status && styles.activeFilterChipText,
                    ]}
                  >
                    {status === "all" ? "All Status" : status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Method:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterChipsContainer}
            >
              {["all", "Credit Card", "Bank Transfer", "Cash", "Check"].map(
                (method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.filterChip,
                      paymentMethodFilter === method && styles.activeFilterChip,
                    ]}
                    onPress={() => setPaymentMethodFilter(method)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        paymentMethodFilter === method &&
                          styles.activeFilterChipText,
                      ]}
                    >
                      {method === "all" ? "All Methods" : method}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() =>
                setSortOrder(sortOrder === "latest" ? "earliest" : "latest")
              }
            >
              <Ionicons name="swap-vertical" size={16} color="#009688" />
              <Text style={styles.sortButtonText}>
                {sortOrder === "latest" ? "Latest First" : "Earliest First"}
              </Text>
            </TouchableOpacity>

            {(searchQuery ||
              statusFilter !== "all" ||
              propertyFilter !== "all" ||
              paymentMethodFilter !== "all") && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPropertyFilter("all");
                  setPaymentMethodFilter("all");
                }}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderPaymentItem = ({ item }: { item: Payment }) => {
    const statusStyle = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={styles.paymentItem}
        onPress={() => handlePaymentPress(item)}
      >
        <View style={styles.paymentHeader}>
          <View style={styles.tenantInfo}>
            <Text style={styles.tenantName}>{item.tenant}</Text>
            <Text style={styles.propertyInfo}>
              {item.property} - {item.unit}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.paymentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>
              ${item.amount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Due Date:</Text>
            <Text style={styles.detailValue}>{item.dueDate}</Text>
          </View>
          {item.paymentDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Date:</Text>
              <Text style={styles.detailValue}>{item.paymentDate}</Text>
            </View>
          )}
          {item.paymentMethod && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Method:</Text>
              <Text style={styles.detailValue}>{item.paymentMethod}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    if (!selectedPayment) return null;

    const statusStyle = getStatusColor(selectedPayment.status);

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
              <Text style={styles.modalTitle}>Payment Details</Text>
              <TouchableOpacity onPress={closeDetailModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>
                  Payment ID: {selectedPayment.id}
                </Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Tenant Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPayment.tenant}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Property:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPayment.property} - {selectedPayment.unit}
                  </Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Payment Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>
                    ${selectedPayment.amount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Due Date:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPayment.dueDate}
                  </Text>
                </View>
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
                      {selectedPayment.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Date:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPayment.paymentDate || "-"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Method:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPayment.paymentMethod || "-"}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {selectedPayment.status === "Paid" && (
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="download" size={20} color="#7e22ce" />
                  <Text style={styles.actionButtonText}>Download PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="mail" size={20} color="#2563eb" />
                  <Text style={styles.actionButtonText}>Share via Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="logo-whatsapp" size={20} color="#16a34a" />
                  <Text style={styles.actionButtonText}>
                    Share via WhatsApp
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.modalFooter}>
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

  const renderRecordPaymentModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={recordPaymentModalVisible}
      onRequestClose={closeRecordPaymentModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Record Payment</Text>
            <TouchableOpacity onPress={closeRecordPaymentModal}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.placeholderText}>
              In a full implementation, this would be a form to record new
              payments.
            </Text>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeRecordPaymentModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
                  router.push("/auth/signin" as any);
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
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity onPress={() => setRecordPaymentModalVisible(true)}>
          <Ionicons name="add" size={24} color="#009688" />
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
          <Text style={styles.sectionTitle}>Payment Management</Text>
          <Text style={styles.sectionSubtitle}>
            Track rent payments and financial transactions
          </Text>
        </View>

        {renderSummaryCards()}
        {renderFilters()}

        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="cash" size={48} color="#009688" />
            <Text style={styles.loadingText}>Loading payments...</Text>
          </View>
        ) : (
          <>
            {currentPayments.length > 0 ? (
              <View style={styles.paymentsList}>
                {currentPayments.map((payment: Payment) => (
                  <View key={payment.id}>
                    {renderPaymentItem({ item: payment })}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="cash" size={48} color="#009688" />
                <Text style={styles.placeholderTitle}>No Payments Found</Text>
                <Text style={styles.placeholderText}>
                  {searchQuery ||
                  statusFilter !== "all" ||
                  propertyFilter !== "all" ||
                  paymentMethodFilter !== "all"
                    ? "No payments match your filters"
                    : "Payment records will appear here"}
                </Text>
              </View>
            )}

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

      {renderDetailModal()}
      {renderRecordPaymentModal()}
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
  filterOptionsContainer: {
    marginBottom: 8,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  filterChipsContainer: {
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: "#009688",
  },
  filterChipText: {
    fontSize: 12,
    color: "#333",
  },
  activeFilterChipText: {
    color: "white",
  },
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#f0fdfa",
    borderWidth: 1,
    borderColor: "#009688",
  },
  sortButtonText: {
    fontSize: 12,
    color: "#009688",
    fontWeight: "500",
    marginLeft: 4,
  },
  clearFiltersButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearFiltersText: {
    fontSize: 12,
    color: "#009688",
    fontWeight: "500",
  },
  paymentsList: {
    marginBottom: 16,
  },
  paymentItem: {
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
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  propertyInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
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
  paymentDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
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
  },
  modalBody: {
    padding: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
  actionButtonText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 4,
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
});
