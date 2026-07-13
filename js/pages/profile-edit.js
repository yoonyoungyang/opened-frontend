const userId = localStorage.getItem("user_id");

const profile_img = document.querySelector(".profile-image-preview");
const email = document.querySelector(".email-value");
const nickname = document.querySelector(".nickname-input");
const editButton = document.querySelector(".edit-button");
const deleteAccountButton = document.querySelector(".withdraw-button");
const toastMessage = document.querySelector(".toast-message");

const profileDropdown = document.querySelector(".profile-dropdown");
const editUserInfoDropdown = document.querySelector(".edit-user-info");
const editPasswordDropdown = document.querySelector(".edit-password");
const logoutDropdown = document.querySelector(".logout");

let beforeProfileImg = null;
let afterProfileImg = null;
let beforeNickname = null;
let afterNickname = null;

if (userId) {
  fetch(`http://localhost:8080/users/me?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message === "user_info_success") {
        console.log(result);
        email.textContent = result.data.email;
        nickname.value = result.data.nickname;
        profile_img.value = result.data.profile_img;

        beforeNickname = result.data.nickname;
        afterNickname = result.data.nickname;
        beforeProfileImg = result.data.afterProfileImg;
        afterProfileImg = result.data.afterProfileImg;
        nickname.addEventListener("input", function () {
          afterNickname = nickname.value;
        });

        fetch(`http://localhost:8080/users/me?userId=${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            nickname: afterNickname,
            profile_img: afterProfileImg,
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
          });
      }
    });
} else {
  window.location.href = "/frontend/pages/posts.html";
}
