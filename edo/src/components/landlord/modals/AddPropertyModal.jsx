import React from "react";
import ConsistentModal from "./ConsistentModal";
import AddPropertyForm from "../forms/AddPropertyForm";

const AddPropertyModal = ({ isOpen, onClose, onSubmit }) => {
  const handleSubmit = (formData) => {
    // Here you would typically send the data to your backend
    console.log("Property data:", formData);
    onSubmit(formData);
    onClose();
  };

  return (
    <ConsistentModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Property"
      maxWidth="sm:max-w-2xl"
    >
      <AddPropertyForm onSubmit={handleSubmit} onClose={onClose} />
    </ConsistentModal>
  );
};

export default AddPropertyModal;
