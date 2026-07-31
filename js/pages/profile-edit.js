import { authenticatedFetch } from "../apis/api.js";

const profile_img = document.querySelector(".profile-image-preview");
const email = document.querySelector(".email-value");
const nickname = document.querySelector(".nickname-input");
const editButton = document.querySelector(".edit-button");
const deleteAccountButton = document.querySelector(".withdraw-button");
const toastMessage = document.querySelector(".toast-message");

const editUserInfoDropdown = document.querySelector(".edit-user-info");
const editPasswordDropdown = document.querySelector(".edit-password");
const logoutDropdown = document.querySelector(".logout");

let beforeProfileImg = null;
let afterProfileImg = null;
let beforeNickname = null;
let afterNickname = null;

toastMessage.hidden = true;

async function fetchGetProfile() {
  const response = await authenticatedFetch(`http://localhost:8080/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response) {
    return;
  }
  const result = await response.json();
  if (result.message === "user_info_success") {
    console.log(result);
    email.textContent = result.data.email;
    nickname.value = result.data.nickname;
    profile_img.value = result.data.profile_img;

    beforeNickname = result.data.nickname;
    afterNickname = result.data.nickname;
    beforeProfileImg = result.data.profile_img;
    afterProfileImg = result.data.profile_img;
    nickname.addEventListener("input", function () {
      afterNickname = nickname.value;
    });
    editButton.addEventListener("click", function (event) {
      event.preventDefault();
      if (beforeNickname == afterNickname) {
        // 리팩토링 시 img도 넣어야 됨.
        alert("변경된 사항이 없습니다."); // 리팩토링 필수!!!!
      } else {
        fetchEditProfile();
      }
    });
  }
}

async function fetchEditProfile() {
  const response = await authenticatedFetch(`http://localhost:8080/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname: afterNickname,
      profile_img: afterProfileImg,
    }),
  });
  if (!response) {
    return;
  }
  const result = await response.json();
  if (result.message === "user_update_success") {
    console.log(result);
    toastMessage.hidden = false;
    requestAnimationFrame(() => {
      toastMessage.classList.add("show");
    });

    setTimeout(() => {
      toastMessage.classList.remove("show");

      setTimeout(() => {
        toastMessage.hidden = true;
        window.location.href = "./posts.html";
      }, 300);
    }, 2000);
  } else {
    toastMessage.textContent = "수정 실패";
    toastMessage.hidden = false;
    requestAnimationFrame(() => {
      toastMessage.classList.add("show");
    });

    setTimeout(() => {
      toastMessage.classList.remove("show");

      setTimeout(() => {
        toastMessage.hidden = true;
      }, 300);
    }, 2000);
  }
}

const modal = document.querySelector(".modal-overlay");

deleteAccountButton.addEventListener("click", deleteUserAction);

function deleteUserAction() {
  modal.hidden = false;
  const cancelButton = document.querySelector(".cancel-button");
  const confirmButton = document.querySelector(".confirm-button");
  cancelButton.addEventListener("click", () => (modal.hidden = true));
  confirmButton.addEventListener("click", fetchDeleteUser);
}

async function fetchDeleteUser() {
  const response = await authenticatedFetch(`http://localhost:8080/users/me`, {
    method: "Delete",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response) {
    return;
  }
  const result = await response.json();
  if (result.message == "user_delete_success") {
    localStorage.removeItem("access_token");
    window.location.href = "./login.html";
    console.log(result);
  }
}

fetchGetProfile();
