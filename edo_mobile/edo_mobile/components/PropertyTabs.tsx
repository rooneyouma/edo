import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface PropertyTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PropertyTabs: React.FC<PropertyTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const propertyTabs = [
    { label: "All", value: "all" },
    { label: "Apartments", value: "apartment" },
    { label: "Houses/Homes", value: "house" },
    { label: "BnBs", value: "bnb" },
    { label: "Commercial", value: "commercial" },
    { label: "Land", value: "land" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {propertyTabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[
              styles.tabButton,
              activeTab === tab.value && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.value)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.value && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  activeTabButton: {
    backgroundColor: "#009688",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#009688",
  },
  activeTabText: {
    color: "white",
  },
});

export default PropertyTabs;
