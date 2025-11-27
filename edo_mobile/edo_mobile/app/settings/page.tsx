import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Profile Information</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Notification Preferences</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>

        <Text style={[styles.sectionTitle, styles.topSpacing]}>
          App Settings
        </Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Language</Text>
          <Text style={styles.settingValue}>English</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Theme</Text>
          <Text style={styles.settingValue}>Light</Text>
        </View>

        <TouchableOpacity style={[styles.settingItem, styles.logoutButton]}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
  },
  topSpacing: {
    marginTop: 32,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
  settingValue: {
    fontSize: 16,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#ffebee",
    marginTop: 24,
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#f44336",
    fontWeight: "600",
  },
});
