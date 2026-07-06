import { $ } from "../utils/dom.js";

const passwordEditForm = $(".password-edit-form");

passwordEditForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});
