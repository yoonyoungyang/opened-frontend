export const openModal = (modalElement) => {
  modalElement?.classList.remove("hidden");
};

export const closeModal = (modalElement) => {
  modalElement?.classList.add("hidden");
};
