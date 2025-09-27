import React from "react";
import ConsistentModal from "./ConsistentModal";
import CreateNoticeForm from "../forms/CreateNoticeForm";

const SendNoticeModal = ({ isOpen, onClose, onSubmit }) => {
  const handleSubmit = (formData) => {
    // Here you would typically send the data to your backend
    console.log("Notice data:", formData);
    onSubmit(formData);
    onClose();
  };

  return (
    <ConsistentModal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Notice"
      maxWidth="sm:max-w-2xl"
    >
      <CreateNoticeForm
        onSubmit={handleSubmit}
        onClose={onClose}
        hideContainer={true}
      />
    </ConsistentModal>
  );
};

export default SendNoticeModal;
