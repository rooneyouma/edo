import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

interface TenantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
}

export default function TenantSidebar({
  isOpen,
  onClose,
  currentRoute,
}: TenantSidebarProps) {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { label: "Dashboard", icon: "grid", route: "/tenant/page" },
    { label: "My Rentals", icon: "business", route: "/tenant/rentals/page" },
    {
      label: "Maintenance",
      icon: "construct",
      route: "/tenant/maintenance/page",
    },
    { label: "Payments", icon: "cash", route: "/tenant/payments/page" },
    { label: "Notices", icon: "document-text", route: "/tenant/notices/page" },
    { label: "Settings", icon: "settings", route: "/settings/page" },
  ];

  const navigateTo = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const goToHomepage = () => {
    onClose();
    router.push("/"); // Navigate to the marketplace homepage
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.sidebarOverlay}
        onPress={onClose}
        onLayout={() => {
          // Preserve navigation bar styling when modal is active
          NavigationBar.setButtonStyleAsync("dark");
        }}
      >
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Tenant Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.sidebarContent}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sidebarItem,
                  currentRoute === item.route && styles.activeSidebarItem,
                ]}
                onPress={() => navigateTo(item.route)}
              >
                <Ionicons name={item.icon as any} size={20} color="#009688" />
                <Text
                  style={[
                    styles.sidebarItemText,
                    currentRoute === item.route && styles.activeSidebarItemText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sidebarFooter}>
            <TouchableOpacity
              style={styles.sidebarFooterItem}
              onPress={goToHomepage}
            >
              <Ionicons name="home" size={20} color="#009688" />
              <Text style={[styles.sidebarFooterText, { color: "#009688" }]}>
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sidebarFooterItem}
              onPress={() => {
                // TODO: Implement logout functionality
                console.log("Logout pressed");
              }}
            >
              <Ionicons name="log-out" size={20} color="#EF4444" />
              <Text style={styles.sidebarFooterText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  activeSidebarItem: {
    borderRightWidth: 3,
    borderRightColor: "#009688",
  },
  sidebarItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  activeSidebarItemText: {
    fontWeight: "bold",
    color: "#009688",
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
});
