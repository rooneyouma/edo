import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TenantSidebar from "../../../components/TenantSidebar";

// Define the rental type
interface Rental {
  id: string;
  property_name: string;
  unit_number: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  monthly_rent: number;
  lease_end_date: string;
  security_deposit: number;
  lease_type: string;
  lease_start_date: string;
  floor: string;
  address: string;
  landlord_name: string;
  landlord_email: string;
  landlord_phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
}

export default function TenantRentals() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  // Mock data for rentals
  const rentals: Rental[] = [
    {
      id: "1",
      property_name: "Sunset Apartments",
      unit_number: "Unit 4B",
      property_type: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      monthly_rent: 1200,
      lease_end_date: "2024-12-31",
      security_deposit: 2400,
      lease_type: "Lease Agreement",
      lease_start_date: "2024-01-01",
      floor: "4th Floor",
      address: "123 Main Street, Nairobi",
      landlord_name: "John Smith",
      landlord_email: "john.smith@landlord.com",
      landlord_phone: "+254 712 345678",
      emergency_contact_name: "Emergency Services",
      emergency_contact_phone: "+254 700 000000",
      emergency_contact_relationship: "Building Management",
    },
    {
      id: "2",
      property_name: "Green Valley Villas",
      unit_number: "Villa 15",
      property_type: "House",
      bedrooms: 3,
      bathrooms: 2,
      monthly_rent: 2500,
      lease_end_date: "2025-06-30",
      security_deposit: 5000,
      lease_type: "Rental Agreement",
      lease_start_date: "2024-07-01",
      floor: "Ground Floor",
      address: "456 Park Avenue, Nairobi",
      landlord_name: "Mary Johnson",
      landlord_email: "mary.johnson@landlord.com",
      landlord_phone: "+254 722 123456",
      emergency_contact_name: "Security Desk",
      emergency_contact_phone: "+254 700 111111",
      emergency_contact_relationship: "24/7 Security",
    },
  ];

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "KES 0";
    return `KES ${amount.toLocaleString()}`;
  };

  const navigateTo = (route: string) => {
    setSidebarOpen(false);
    router.push(route as any);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Tenant Sidebar */}
      <TenantSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRoute="/tenant/rentals/page"
      />

      {/* Rental Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedRental}
        onRequestClose={() => setSelectedRental(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setSelectedRental(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedRental?.property_name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedRental(null)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Lease Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lease Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Monthly Rent</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental
                      ? formatCurrency(selectedRental.monthly_rent)
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Security Deposit</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental
                      ? formatCurrency(selectedRental.security_deposit)
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Agreement Type</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.lease_type || "N/A"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Start Date</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental
                      ? formatDate(selectedRental.lease_start_date)
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>End Date</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental
                      ? formatDate(selectedRental.lease_end_date)
                      : "N/A"}
                  </Text>
                </View>
              </View>

              {/* Property Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Property Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Type</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.property_type}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Floor</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.floor || "N/A"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Bedrooms</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.bedrooms}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Bathrooms</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.bathrooms}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.address}
                  </Text>
                </View>
              </View>

              {/* Contact Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>

                {/* Landlord Contact */}
                <Text style={styles.subSectionTitle}>Landlord</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.landlord_name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.landlord_email}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.landlord_phone || "N/A"}
                  </Text>
                </View>

                {/* Emergency Contact */}
                <Text style={styles.subSectionTitle}>Emergency Contact</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.emergency_contact_name || "N/A"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.emergency_contact_phone || "N/A"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Relationship</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental?.emergency_contact_relationship || "N/A"}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedRental(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Main Content */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu" size={24} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Rentals</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {rentals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="home-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No Rental Properties</Text>
            <Text style={styles.emptyStateText}>
              You don't have any rental properties yet. Contact your landlord to
              get started.
            </Text>
          </View>
        ) : (
          <View style={styles.rentalsContainer}>
            {rentals.map((rental) => (
              <TouchableOpacity
                key={rental.id}
                style={styles.rentalCard}
                onPress={() => setSelectedRental(rental)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.propertyName} numberOfLines={1}>
                    {rental.property_name}
                  </Text>
                  <Text style={styles.unitNumber}>{rental.unit_number}</Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Type:</Text>
                    <Text style={styles.infoValue}>{rental.property_type}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Rooms:</Text>
                    <Text style={styles.infoValue}>
                      {rental.bedrooms}B {rental.bathrooms}B
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Rent:</Text>
                    <Text style={styles.infoValue}>
                      {formatCurrency(rental.monthly_rent)}/mo
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Lease Ends:</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(rental.lease_end_date)}
                    </Text>
                  </View>
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
  },
  rentalsContainer: {
    paddingVertical: 16,
  },
  rentalCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0d9488",
    flex: 1,
    marginRight: 8,
  },
  unitNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 0,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    textAlign: "right",
    flex: 1,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    padding: 16,
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
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
    marginBottom: 8,
  },
  infoRowModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  infoLabelModal: {
    fontSize: 14,
    color: "#666",
  },
  infoValueModal: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  closeButton: {
    backgroundColor: "#009688",
    padding: 16,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
