import { $ } from "../utils/dom.js";
import { closeModal, openModal } from "../components/modal.js";
import { toggleProfileMenu } from "../components/profileMenu.js";

const profileMenuButton = $(".profile-menu-button");
const profileDropdown = $(".profile-dropdown");
const withdrawButton = $(".withdraw-button");
const modal = $(".modal-overlay");
const cancelButton = $(".cancel-button", modal);

profileMenuButton?.addEventListener("click", () => {
  toggleProfileMenu(profileDropdown);
});

withdrawButton?.addEventListener("click", () => openModal(modal));
cancelButton?.addEventListener("click", () => closeModal(modal));
