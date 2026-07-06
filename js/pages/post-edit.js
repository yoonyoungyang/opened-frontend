import { $ } from "../utils/dom.js";

const editForm = $(".edit-form");

editForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});
