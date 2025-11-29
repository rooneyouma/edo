import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TenantSidebar from "../../components/TenantSidebar";

export default function TenantDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState({
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data for tenant overview
  const tenantOverview = [
    {
      title: "Current Property",
      value: "24 Main St",
      icon: "home",
      color: "#3B82F6",
    },
    { title: "Monthly Rent", value: "$1,200", icon: "cash", color: "#10B981" },
    {
      title: "Lease Ends",
      value: "Dec 31, 2024",
      icon: "calendar",
      color: "#8B5CF6",
    },
    {
      title: "Next Payment",
      value: "Aug 1, 2024",
      icon: "card",
      color: "#F59E0B",
    },
  ];

  // Mock data for quick actions
  const quickActions = [
    { label: "Pay Rent", icon: "card", action: "payRent" },
    { label: "Maintenance", icon: "construct", action: "maintenance" },
    { label: "Notices", icon: "document-text", action: "notices" },
  ];

  // Mock data for recent activity
  const activityTimeline = [
    {
      type: "payment",
      label: "Rent payment received: $1,200",
      date: "Jul 1, 2024",
      icon: "cash",
    },
    {
      type: "notice",
      label: "New notice: Maintenance schedule",
      date: "Jun 28, 2024",
      icon: "document-text",
    },
    {
      type: "maintenance",
      label: "Maintenance request submitted",
      date: "Jun 25, 2024",
      icon: "construct",
    },
    {
      type: "message",
      label: "Message from landlord",
      date: "Jun 20, 2024",
      icon: "chatbubble",
    },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "payRent":
        // Handle pay rent action
        console.log("Pay rent action");
        break;
      case "maintenance":
        // Handle maintenance action
        console.log("Maintenance action");
        break;
      case "notices":
        // Handle notices action
        console.log("Notices action");
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Tenant Sidebar */}
      <TenantSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRoute="/tenant/page"
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu" size={24} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tenant Dashboard</Text>
        <TouchableOpacity onPress={() => router.push("/settings/page")}>
          <Ionicons name="settings-outline" size={24} color="#009688" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner with Profile Picture */}
        <View style={styles.welcomeBanner}>
          {user.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitials}>
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </Text>
            </View>
          )}
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>
              Welcome, {user.firstName} {user.lastName}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Here's what's happening with your rental today.
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={() => handleQuickAction(action.action)}
              >
                <Ionicons name={action.icon as any} size={20} color="white" />
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tenant Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rental Overview</Text>
          <View style={styles.overviewGrid}>
            {tenantOverview.map((item, index) => (
              <View key={index} style={styles.overviewCard}>
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: item.color + "20" },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={item.color}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardValue}>{item.value}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            {activityTimeline.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <Ionicons
                    name={activity.icon as any}
                    size={16}
                    color="#009688"
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityLabel}>{activity.label}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
              </View>
            ))}
          </View>
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
    paddingHorizontal: 16,
  },
  welcomeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#009688",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileInitials: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  overviewCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  quickActionButton: {
    backgroundColor: "#009688",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: "31%",
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
  },
  activityContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: "#999",
  },
});
