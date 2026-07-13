const userId = localStorage.getItem("user_id");

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
        editButton.addEventListener("click", function () {
          if (beforeNickname == afterNickname) {
            // 리팩토링 시 img도 넣어야 됨.
            alert("변경된 사항이 없습니다."); // 리팩토링 필수!!!!
          } else {
            event.preventDefault();
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
                      window.location.href = "/frontend/pages/posts.html";
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
              });
          }
        });
      }
    });
}

const profileMenuButton = document.querySelector(".profile-menu-button");
const profileDropdown = document.querySelector(".profile-dropdown");

profileMenuButton.addEventListener("click", function () {
  profileDropdown.hidden = !profileDropdown.hidden;

  profileMenuButton.setAttribute(
    "aria-expanded",
    String(!profileDropdown.hidden),
  );
});
