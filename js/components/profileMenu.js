export const toggleProfileMenu = (menuElement) => {
  menuElement?.classList.toggle("hidden");
};

export const closeProfileMenu = (menuElement) => {
  menuElement?.classList.add("hidden");
};
