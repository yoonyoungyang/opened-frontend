import { $ } from "../utils/dom.js";

const createForm = $(".create-form");

createForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});
