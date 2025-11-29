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
import LandlordSidebar from "../../components/LandlordSidebar";

export default function LandlordDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  });

  // Mock data for analytics cards
  const analyticsData = [
    {
      title: "Total Properties",
      value: "24",
      icon: "home",
      color: "#3B82F6",
      trend: "+2 from last month",
    },
    {
      title: "Total Units",
      value: "120",
      icon: "people",
      color: "#6366F1",
      trend: "+5 from last month",
    },
    {
      title: "Occupied Units",
      value: "95",
      subtitle: "79% occupancy rate",
      icon: "checkmark-circle",
      color: "#10B981",
      trend: "+3 from last month",
    },
    {
      title: "Vacant Units",
      value: "25",
      icon: "home-outline",
      color: "#F97316",
      trend: "-2 from last month",
    },
  ];

  // Mock data for financial summary
  const financialData = [
    {
      title: "Total Monthly Rent",
      amount: "$120,000",
      icon: "cash",
      color: "#8B5CF6",
      change: { type: "positive", value: "+5.2% from last month" },
    },
    {
      title: "Collected This Month",
      amount: "$100,000",
      icon: "card",
      color: "#10B981",
      change: { type: "positive", value: "83.3% collection rate" },
    },
    {
      title: "Pending Payments",
      amount: "$12,000",
      icon: "pie-chart",
      color: "#EAB308",
      change: { type: "negative", value: "10 units pending" },
    },
    {
      title: "Overdue Payments",
      amount: "$8,000",
      icon: "alert-circle",
      color: "#EF4444",
      change: { type: "negative", value: "6 units overdue" },
    },
  ];

  // Mock data for recent activity
  const activityTimeline = [
    {
      type: "tenant",
      label: "New tenant added: John Doe",
      date: "Jul 3, 2024",
      icon: "people",
    },
    {
      type: "payment",
      label: "Received $2,400 rent",
      date: "Jul 2, 2024",
      icon: "cash",
    },
    {
      type: "maintenance",
      label: "Maintenance completed: AC repair",
      date: "Jul 1, 2024",
      icon: "construct",
    },
    {
      type: "notice",
      label: "Notice sent: Lease renewal",
      date: "Jun 30, 2024",
      icon: "document-text",
    },
  ];

  // Quick actions
  const quickActions = [
    { label: "Add Property", icon: "add", action: "addProperty" },
    { label: "Rent Reminders", icon: "notifications", action: "rentReminders" },
    { label: "Send Notice", icon: "document-text", action: "sendNotice" },
  ];

  // Sidebar menu items
  const menuItems = [
    {
      label: "Dashboard",
      icon: "grid-outline",
      route: "/landlord/page" as const,
    },
    {
      label: "Properties",
      icon: "home",
      route: "/landlord/properties/page" as const,
    },
    {
      label: "Tenants",
      icon: "people",
      route: "/landlord/tenants/page" as const,
    },
    {
      label: "Maintenance",
      icon: "construct",
      route: "/landlord/maintenance/page" as const,
    },
    {
      label: "Payments",
      icon: "cash",
      route: "/landlord/payments/page" as const,
    },
    {
      label: "Notices",
      icon: "document-text",
      route: "/landlord/notices/page" as const,
    },
    { label: "Settings", icon: "settings", route: "/settings/page" as const },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "addProperty":
        // Handle add property action
        console.log("Add property action");
        break;
      case "rentReminders":
        // Handle rent reminders action
        console.log("Rent reminders action");
        break;
      case "sendNotice":
        // Handle send notice action
        console.log("Send notice action");
        break;
      default:
        break;
    }
  };

  const navigateTo = (route: any) => {
    setSidebarOpen(false);
    router.push(route);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <LandlordSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRoute="/landlord/page"
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu" size={24} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Landlord Dashboard</Text>
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
              Here's what's happening with your properties today.
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

        {/* Property Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Overview</Text>
          <View style={styles.analyticsGrid}>
            {analyticsData.map((item, index) => (
              <View key={index} style={styles.analyticsCard}>
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
                  {item.subtitle && (
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                  )}
                  <Text style={styles.cardTrend}>{item.trend}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.financialGrid}>
            {financialData.map((item, index) => (
              <View key={index} style={styles.financialCard}>
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
                  <Text style={styles.financialAmount}>{item.amount}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View
                    style={[
                      styles.changeBadge,
                      item.change.type === "positive"
                        ? styles.positiveBadge
                        : styles.negativeBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.changeText,
                        item.change.type === "positive"
                          ? styles.positiveText
                          : styles.negativeText,
                      ]}
                    >
                      {item.change.value}
                    </Text>
                  </View>
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
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  analyticsCard: {
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
  financialGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  financialCard: {
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  financialAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  cardTrend: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
  },
  changeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveBadge: {
    backgroundColor: "#D1FAE5",
  },
  negativeBadge: {
    backgroundColor: "#FEE2E2",
  },
  changeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  positiveText: {
    color: "#047857",
  },
  negativeText: {
    color: "#B91C1C",
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
