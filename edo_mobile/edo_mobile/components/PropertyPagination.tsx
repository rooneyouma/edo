import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PropertyPagination: React.FC<PropertyPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [showGoToPage, setShowGoToPage] = useState(false);
  const [pageNumber, setPageNumber] = useState("");
  const insets = useSafeAreaInsets();

  if (totalPages <= 1) return null;

  const handleGoToPage = () => {
    const pageNumberInt = parseInt(pageNumber);
    if (
      isNaN(pageNumberInt) ||
      pageNumberInt < 1 ||
      pageNumberInt > totalPages
    ) {
      Alert.alert(
        "Invalid Page",
        `Please enter a number between 1 and ${totalPages}`
      );
      return;
    }
    onPageChange(pageNumberInt);
    setShowGoToPage(false);
    setPageNumber("");
  };

  return (
    <View
      style={[styles.paginationContainer, { paddingBottom: insets.bottom }]}
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
          onPress={() => onPageChange(currentPage - 1)}
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
          onPress={() => setShowGoToPage(true)}
        >
          <Text style={styles.pageNumberText}>{currentPage}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentPage === totalPages ? "#ccc" : "#009688"}
          />
        </TouchableOpacity>
      </View>

      {/* Go to Page Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showGoToPage}
        onRequestClose={() => setShowGoToPage(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowGoToPage(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Go to Page</Text>
            <Text style={styles.modalSubtitle}>
              Enter a page number between 1 and {totalPages}
            </Text>

            <TextInput
              style={styles.pageInput}
              placeholder="Page number"
              keyboardType="numeric"
              value={pageNumber}
              onChangeText={setPageNumber}
              autoFocus={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowGoToPage(false);
                  setPageNumber("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.goButton]}
                onPress={handleGoToPage}
              >
                <Text style={styles.goButtonText}>Go</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4, // Reduced from 8 to 4
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    // paddingBottom dynamically set based on safe area insets
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  pageInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  goButton: {
    backgroundColor: "#009688",
  },
  goButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default PropertyPagination;
