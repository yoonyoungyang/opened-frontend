export const showToast = (toastElement, message, duration = 2000) => {
  if (!toastElement) {
    return;
  }

  toastElement.textContent = message;
  toastElement.classList.remove("hidden");

  window.setTimeout(() => {
    toastElement.classList.add("hidden");
  }, duration);
};
