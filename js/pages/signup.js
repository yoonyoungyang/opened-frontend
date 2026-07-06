import { $ } from "../utils/dom.js";

const signupForm = $(".signup-form");

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});
