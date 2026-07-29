async function initializeHeader() {
  const headerMount = document.querySelector("[data-header]");

  if (!headerMount) {
    return;
  }

  const response = await fetch("../components/header.html");

  if (!response.ok) {
    throw new Error("헤더를 불러오지 못했습니다.");
  }

  const headerHtml = await response.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = headerHtml.trim();

  const header = wrapper.firstElementChild;

  configureBackButton(header, headerMount);
  configureProfile(header, headerMount);

  headerMount.replaceWith(header);
}

function configureBackButton(header, headerMount) {
  const backButton = header.querySelector(".back-button");
  const showBackButton = headerMount.dataset.back === "true";
  const backLabel = headerMount.dataset.backLabel;

  if (!backButton) {
    return;
  }

  if (!showBackButton) {
    backButton.remove();
    return;
  }

  if (backLabel) {
    backButton.setAttribute("aria-label", backLabel);
  }

  backButton.addEventListener("click", () => {
    window.history.back();
  });
}

function configureProfile(header, headerMount) {
  const profileType = headerMount.dataset.profile;
  const profileMenu = header.querySelector(".profile-menu");

  if (profileType !== "menu") {
    profileMenu?.remove();
    return;
  }

  initializeProfileMenu(profileMenu);
}

function initializeProfileMenu(profileMenu) {
  if (!profileMenu) {
    return;
  }

  const menuButton = profileMenu.querySelector(".profile-menu-button");
  const dropdown = profileMenu.querySelector(".profile-dropdown");

  if (!menuButton || !dropdown) {
    return;
  }

  menuButton.addEventListener("click", () => {
    dropdown.hidden = !dropdown.hidden;

    menuButton.setAttribute("aria-expanded", String(!dropdown.hidden));
  });
}

initializeHeader().catch((error) => {
  console.error(error);
});
