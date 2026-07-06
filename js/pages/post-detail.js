import { $, $$ } from "../utils/dom.js";
import { closeModal, openModal } from "../components/modal.js";

const modal = $(".modal-overlay");
const deleteButtons = $$(".small-button").filter(
  (button) => button.textContent.trim() === "삭제",
);
const cancelButton = $(".cancel-button", modal);

deleteButtons.forEach((button) => {
  button.addEventListener("click", () => openModal(modal));
});

cancelButton?.addEventListener("click", () => closeModal(modal));
