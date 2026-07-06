import { $ } from "../utils/dom.js";

const writeButton = $(".write-button");

writeButton?.addEventListener("click", () => {
  window.location.href = "./post-create.html";
});
