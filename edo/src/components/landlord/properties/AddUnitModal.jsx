import React, { useState } from "react";
import ConsistentModal from "../modals/ConsistentModal";
import DynamicUnitForm from "./DynamicUnitForm";
import { landlordPropertyAPI } from "../../../utils/api";

const AddUnitModal = ({ isOpen, onClose, property, onUnitAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !property) return null;

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const unitData = {
        property: property.id,
        ...formData,
      };
      const response = await landlordPropertyAPI.createUnit(unitData);
      if (onUnitAdded) onUnitAdded(response);
      onClose();
    } catch (err) {
      setError("Failed to add unit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConsistentModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Unit to ${property.name}`}
      maxWidth="max-w-4xl"
    >
      <DynamicUnitForm
        propertyType={property.type}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        error={error}
        submitButtonText="Add Unit"
        isEdit={false}
      />
    </ConsistentModal>
  );
};

export default AddUnitModal;
