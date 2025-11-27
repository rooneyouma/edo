import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

const MarketplaceHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const navigateToBookmarks = () => {
    setShowMenu(false);
    router.push("/bookmarks/page");
  };

  const navigateToListProperty = () => {
    setShowMenu(false);
    router.push("/list-property/page");
  };

  const navigateToSettings = () => {
    setShowMenu(false);
    router.push("/settings/page");
  };

  return (
    <View style={styles.headerContainer}>
      <StatusBar style="dark" />
      <View style={styles.headerContent}>
        {/* Logo/Brand */}
        <Text style={styles.logo}>edo</Text>

        {/* Right side icons */}
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={navigateToBookmarks}
          >
            <Ionicons name="bookmark-outline" size={24} color="#009688" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Ionicons name="menu" size={24} color="#009688" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu dropdown - using Modal to ensure it's on top */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showMenu}
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.dropdownMenu,
              { transform: [{ scale: showMenu ? 1 : 0.9 }] },
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMenu(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItemsContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={navigateToBookmarks}
              >
                <Ionicons
                  name="bookmark-outline"
                  size={20}
                  color="#009688"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>Bookmarks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={navigateToListProperty}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color="#009688"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>List Property</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#009688"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons
                  name="pricetag-outline"
                  size={20}
                  color="#009688"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>Pricing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#009688"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>FAQ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={navigateToSettings}
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color="#009688"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.lastMenuItem}>
                <Ionicons
                  name="log-in-outline"
                  size={20}
                  color="#009688"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009688",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Further increased opacity for better dimming
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginTop: 70,
    marginRight: 16,
    width: 280,
    maxHeight: 400,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  menuItemsContainer: {
    paddingVertical: 8,
    // Reduced padding to decrease spacing between menu items
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    // Reduced padding to decrease spacing between menu items
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  // Updated style for the last menu item
  lastMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    // Reduced padding to decrease spacing between menu items
    paddingVertical: 8,
    paddingHorizontal: 16,
    // Removed marginBottom to prevent spacing issues
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

export default MarketplaceHeader;
