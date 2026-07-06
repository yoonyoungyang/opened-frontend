import { $ } from "../utils/dom.js";

const loginForm = $(".login-form");

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});
