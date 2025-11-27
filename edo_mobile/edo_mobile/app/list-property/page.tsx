import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import CustomSelect from "../../components/CustomSelect";

export default function ListPropertyScreen() {
  const router = useRouter();
  const [listingType, setListingType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [amenities, setAmenities] = useState("");

  // Wizard step state for BnB
  const [bnbStep, setBnbStep] = useState(1);
  const [bnbData, setBnbData] = useState({
    propertyType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
  });

  // Minimal validation for BnB wizard
  const bnbStepValid = () => {
    if (bnbStep === 1) return !!bnbData.propertyType;
    if (bnbStep === 2) return !!bnbData.title && !!bnbData.description;
    if (bnbStep === 3) return !!bnbData.location && !!bnbData.price;
    if (bnbStep === 4) return true;
    return false;
  };

  const handleBnbChange = (field: string, value: string) => {
    setBnbData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBnbNext = () => {
    if (bnbStep < 4 && bnbStepValid()) setBnbStep(bnbStep + 1);
  };
  const handleBnbBack = () => {
    if (bnbStep > 1) setBnbStep(bnbStep - 1);
  };
  const handleBnbSubmit = (e: any) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  // Wizard step state for Rental
  const [rentalStep, setRentalStep] = useState(1);
  const [rentalData, setRentalData] = useState({
    propertyType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
  });

  const rentalStepValid = () => {
    if (rentalStep === 1) return !!rentalData.propertyType;
    if (rentalStep === 2) return !!rentalData.title && !!rentalData.description;
    if (rentalStep === 3) return !!rentalData.location && !!rentalData.price;
    if (rentalStep === 4) return true;
    return false;
  };

  const handleRentalChange = (field: string, value: string) => {
    setRentalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRentalNext = () => {
    if (rentalStep < 4 && rentalStepValid()) setRentalStep(rentalStep + 1);
  };
  const handleRentalBack = () => {
    if (rentalStep > 1) setRentalStep(rentalStep - 1);
  };
  const handleRentalSubmit = (e: any) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  // Wizard step state for Property for Sale
  const [propertyStep, setPropertyStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    propertyType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
  });

  const propertyStepValid = () => {
    if (propertyStep === 1) return !!propertyData.propertyType;
    if (propertyStep === 2) return !!propertyData.title;
    if (propertyStep === 3)
      return !!propertyData.location && !!propertyData.price;
    if (propertyStep === 4) return true;
    return false;
  };

  const handlePropertyChange = (field: string, value: string) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePropertyNext = () => {
    if (propertyStep < 4 && propertyStepValid())
      setPropertyStep(propertyStep + 1);
  };
  const handlePropertyBack = () => {
    if (propertyStep > 1) setPropertyStep(propertyStep - 1);
  };
  const handlePropertySubmit = (e: any) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  // Wizard step state for Land & Development
  const [landStep, setLandStep] = useState(1);
  const [landData, setLandData] = useState({
    landType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    area: "",
    amenities: "",
  });

  const landStepValid = () => {
    if (landStep === 1) return !!landData.landType;
    if (landStep === 2) return !!landData.title;
    if (landStep === 3)
      return !!landData.location && !!landData.price && !!landData.area;
    if (landStep === 4) return true;
    return false;
  };

  const handleLandChange = (field: string, value: string) => {
    setLandData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLandNext = () => {
    if (landStep < 4 && landStepValid()) setLandStep(landStep + 1);
  };
  const handleLandBack = () => {
    if (landStep > 1) setLandStep(landStep - 1);
  };
  const handleLandSubmit = (e: any) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  // Wizard step state for Commercial Space
  const [commercialStep, setCommercialStep] = useState(1);
  const [commercialData, setCommercialData] = useState({
    propertyType: "",
    title: "",
    description: "",
    location: "",
    price: "",
    area: "",
    amenities: "",
  });

  const commercialStepValid = () => {
    if (commercialStep === 1) return !!commercialData.propertyType;
    if (commercialStep === 2) return !!commercialData.title;
    if (commercialStep === 3)
      return (
        !!commercialData.location &&
        !!commercialData.price &&
        !!commercialData.area
      );
    if (commercialStep === 4) return true;
    return false;
  };

  const handleCommercialChange = (field: string, value: string) => {
    setCommercialData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCommercialNext = () => {
    if (commercialStep < 4 && commercialStepValid())
      setCommercialStep(commercialStep + 1);
  };
  const handleCommercialBack = () => {
    if (commercialStep > 1) setCommercialStep(commercialStep - 1);
  };
  const handleCommercialSubmit = (e: any) => {
    e.preventDefault();
    // Submit logic here
    router.push("/");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you would typically handle the property listing process
    // For now, we'll just navigate back to the marketplace
    router.push("/");
  };

  // Modal state for wizards
  const [openWizard, setOpenWizard] = useState<string | null>(null); // 'bnb' | 'rental' | 'sale' | 'land' | 'commercial' | null

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <StatusBar style="light" />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>List Your Property</Text>
            <Text style={styles.headerSubtitle}>
              Share your space with the edo community
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listingTypeContainer}>
          <Text style={styles.listingTypeLabel}>
            What would you like to list?
          </Text>
          <View style={styles.listingTypeGrid}>
            <TouchableOpacity
              style={[
                styles.listingTypeButton,
                listingType === "bnb" && styles.selectedListingType,
              ]}
              onPress={() => {
                setListingType("bnb");
                setOpenWizard("bnb");
              }}
            >
              <Text style={styles.listingTypeTitle}>BnB</Text>
              <Text style={styles.listingTypeDescription}>
                Welcome travelers to your unique space
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.listingTypeButton,
                listingType === "rental" && styles.selectedListingType,
              ]}
              onPress={() => {
                setListingType("rental");
                setOpenWizard("rental");
              }}
            >
              <Text style={styles.listingTypeTitle}>Rental</Text>
              <Text style={styles.listingTypeDescription}>
                Find the perfect tenant for your property
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.listingTypeButton,
                listingType === "sale" && styles.selectedListingType,
              ]}
              onPress={() => {
                setListingType("sale");
                setOpenWizard("sale");
              }}
            >
              <Text style={styles.listingTypeTitle}>Property for Sale</Text>
              <Text style={styles.listingTypeDescription}>
                Connect with potential buyers for your property
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.listingTypeButton,
                listingType === "land" && styles.selectedListingType,
              ]}
              onPress={() => {
                setListingType("land");
                setOpenWizard("land");
              }}
            >
              <Text style={styles.listingTypeTitle}>Land & Development</Text>
              <Text style={styles.listingTypeDescription}>
                Showcase your land for development or investment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.listingTypeButton,
                listingType === "commercial" && styles.selectedListingType,
              ]}
              onPress={() => {
                setListingType("commercial");
                setOpenWizard("commercial");
              }}
            >
              <Text style={styles.listingTypeTitle}>Commercial Space</Text>
              <Text style={styles.listingTypeDescription}>
                List your commercial property for businesses
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* BnB Wizard Modal */}
      <Modal
        visible={openWizard === "bnb"}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOpenWizard(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>List BnB Property</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setOpenWizard(null)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.stepIndicator}>
                {[1, 2, 3, 4].map((step) => (
                  <View
                    key={step}
                    style={[
                      styles.stepDot,
                      bnbStep >= step && styles.activeStepDot,
                    ]}
                  />
                ))}
              </View>

              {bnbStep === 1 && (
                <View style={styles.wizardStep}>
                  <Text style={styles.stepTitle}>Property Type</Text>
                  <CustomSelect
                    options={[
                      { value: "", label: "Select a property type" },
                      { value: "house", label: "Entire House" },
                      { value: "apartment", label: "Entire Apartment" },
                      { value: "room", label: "Private Room" },
                      { value: "villa", label: "Villa" },
                      { value: "cabin", label: "Cabin" },
                    ]}
                    value={bnbData.propertyType}
                    onChange={(value) => handleBnbChange("propertyType", value)}
                  />
                </View>
              )}

              {bnbStep === 2 && (
                <View style={styles.wizardStep}>
                  <Text style={styles.stepTitle}>Property Details</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                      style={styles.textInput}
                      value={bnbData.title}
                      onChangeText={(value) => handleBnbChange("title", value)}
                      placeholder="Beautiful beachfront villa"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Description (optional)
                    </Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={bnbData.description}
                      onChangeText={(value) =>
                        handleBnbChange("description", value)
                      }
                      placeholder="Describe your property..."
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>
              )}

              {bnbStep === 3 && (
                <View style={styles.wizardStep}>
                  <Text style={styles.stepTitle}>Location & Pricing</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Location</Text>
                    <TextInput
                      style={styles.textInput}
                      value={bnbData.location}
                      onChangeText={(value) =>
                        handleBnbChange("location", value)
                      }
                      placeholder="123 Main St, City"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Price (per night)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={bnbData.price}
                      onChangeText={(value) => handleBnbChange("price", value)}
                      placeholder="Enter price"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}

              {bnbStep === 4 && (
                <View style={styles.wizardStep}>
                  <Text style={styles.stepTitle}>Property Features</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Bedrooms</Text>
                    <TextInput
                      style={styles.textInput}
                      value={bnbData.bedrooms}
                      onChangeText={(value) =>
                        handleBnbChange("bedrooms", value)
                      }
                      placeholder="Number of bedrooms"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Bathrooms</Text>
                    <TextInput
                      style={styles.textInput}
                      value={bnbData.bathrooms}
                      onChangeText={(value) =>
                        handleBnbChange("bathrooms", value)
                      }
                      placeholder="Number of bathrooms"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Amenities (comma-separated)
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={bnbData.amenities}
                      onChangeText={(value) =>
                        handleBnbChange("amenities", value)
                      }
                      placeholder="WiFi, Pool, Parking..."
                    />
                  </View>
                </View>
              )}

              <View style={styles.wizardActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.wizardBackButton]}
                  onPress={handleBnbBack}
                  disabled={bnbStep === 1}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                {bnbStep < 4 ? (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.nextButton]}
                    onPress={handleBnbNext}
                    disabled={!bnbStepValid()}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.submitButton]}
                    onPress={handleBnbSubmit}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Rental Wizard Modal */}
      <Modal
        visible={openWizard === "rental"}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOpenWizard(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>List Rental Property</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setOpenWizard(null)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.stepIndicator}>
                {[1, 2, 3, 4].map((step) => (
                  <View
                    key={step}
                    style={[
                      styles.stepDot,
                      rentalStep >= step && styles.activeStepDot,
                    ]}
                  />
                ))}
              </View>

              {rentalStep === 1 && (
                <View style={styles.wizardStep}>
                  <Text style={styles.stepTitle}>Property Type</Text>
                  <CustomSelect
                    options={[
                      { value: "", label: "Select a property type" },
                      { value: "apartment", label: "Apartment" },
                      { value: "house", label: "House" },
                      { value: "condo", label: "Condo" },
                      { value: "townhouse", label: "Townhouse" },
                      { value: "loft", label: "Loft" },
                    ]}
                    value={rentalData.propertyType}
                    onChange={(value) =>
                      handleRentalChange("propertyType", value)
                    }
                  />
                </View>
              )}

              {rentalStep === 2 && (
                <View style={styles.wizardStep}>
                  <Text style={styles.stepTitle}>Property Details</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rentalData.title}
                      onChangeText={(value) =>
                        handleRentalChange("title", value)
                      }
                      placeholder="Modern downtown apartment"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Description (optional)
                    </Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={rentalData.description}
                      onChangeText={(value) =>
                        handleRentalChange("description", value)
                      }
                      placeholder="Describe your property..."
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>
              )}

              {rentalStep === 3 && (
                <View style={styles.wizardStep}>
                  <Text style={styles.stepTitle}>Location & Pricing</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Location</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rentalData.location}
                      onChangeText={(value) =>
                        handleRentalChange("location", value)
                      }
                      placeholder="123 Main St, City"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Price (per month)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rentalData.price}
                      onChangeText={(value) =>
                        handleRentalChange("price", value)
                      }
                      placeholder="Enter price"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}

              {rentalStep === 4 && (
                <View style={styles.wizardStep}>
                  <Text style={styles.stepTitle}>Property Features</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Bedrooms</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rentalData.bedrooms}
                      onChangeText={(value) =>
                        handleRentalChange("bedrooms", value)
                      }
                      placeholder="Number of bedrooms"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Bathrooms</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rentalData.bathrooms}
                      onChangeText={(value) =>
                        handleRentalChange("bathrooms", value)
                      }
                      placeholder="Number of bathrooms"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Amenities (comma-separated)
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={rentalData.amenities}
                      onChangeText={(value) =>
                        handleRentalChange("amenities", value)
                      }
                      placeholder="WiFi, Gym, Parking..."
                    />
                  </View>
                </View>
              )}

              <View style={styles.wizardActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.wizardBackButton]}
                  onPress={handleRentalBack}
                  disabled={rentalStep === 1}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                {rentalStep < 4 ? (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.nextButton]}
                    onPress={handleRentalNext}
                    disabled={!rentalStepValid()}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.submitButton]}
                    onPress={handleRentalSubmit}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    backgroundColor: "#009688",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listingTypeContainer: {
    paddingVertical: 20,
  },
  listingTypeLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  listingTypeGrid: {
    flexDirection: "column",
    gap: 12,
  },
  listingTypeButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "white",
  },
  selectedListingType: {
    borderColor: "#009688",
    backgroundColor: "#f0fdfa",
  },
  listingTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  listingTypeDescription: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // Ensure full screen coverage
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignSelf: "center", // Ensure the modal is centered
    marginVertical: 20, // Add some margin to prevent touching edges
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },

  modalScrollView: {
    padding: 16,
    // Add some extra padding at the bottom to ensure content doesn't touch the edge
    paddingBottom: 24,
  },
  wizardContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  activeStepDot: {
    backgroundColor: "#009688",
  },
  wizardStep: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  wizardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  wizardBackButton: {
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  backButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#009688",
    marginLeft: 8,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#009688",
    flex: 1,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
