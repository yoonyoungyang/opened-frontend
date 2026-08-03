import { authenticatedFetch } from "../apis/api.js";
const formEl = document.querySelector(".password-edit-form");

const formCurrentPassword = document.querySelector("#current-password");

const formNewPw = document.querySelector("#new-password");
const formNewPwConfirm = document.querySelector("#password-confirm");
formNewPw.addEventListener("input", updateButtonState);
const submitEl = document.querySelector(".edit-button");

const toastMessage = document.querySelector(".toast-message");

function updateButtonState() {
  submitEl.disabled = !(
    validateCurrentPassword(formCurrentPassword, true) &&
    isNewPasswordValid &&
    isNewPwConfirmValid
  );
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  const isNewPasswordValid = validateNewPassword(formNewPw);

  if (isNewPasswordValid) {
    fetchEditPassword();
  }
});

function validateCurrentPassword(formCurrentPassword, showEmptyMessage) {
  const currentPwValue = formCurrentPassword.value;
  const currentPwTxt = document.querySelector(".current-password-helper-text");

  if (!currentPwValue) {
    if (showEmptyMessage) {
      currentPwTxt.textContent = "비밀번호를 입력해주세요.";
    } else {
      currentPwTxt.textContent = "";
    }
    return false;
  } else {
    currentPwTxt.textContent = "";
    return true;
  }
}

formCurrentPassword.addEventListener("input", function () {
  validateCurrentPassword(formCurrentPassword, true);
  updateButtonState();
});

function validateNewPassword(formNewPw, showEmptyMessage) {
  const newPasswordValue = formNewPw.value;
  const newPwConfirmValue = formNewPwConfirm.value;
  const regPas =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/;
  const newPwHelpTxt = document.querySelector(".new-password-helper-text");

  if (newPasswordValue == "") {
    if (showEmptyMessage) {
      newPwHelpTxt.textContent = "비밀번호를 입력해주세요.";
    } else {
      newPwHelpTxt.textContent = "";
    }
    return false;
  } else if (!regPas.test(newPasswordValue)) {
    newPwHelpTxt.textContent =
      "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    return false;
  }
  if (newPwConfirmValue !== "" && newPasswordValue !== newPwConfirmValue) {
    newPwHelpTxt.textContent = "*비밀번호 확인과 다릅니다.";
    return false;
  } else {
    newPwHelpTxt.textContent = "";
    return true;
  }
}

function validateNewPwConfirm(formNewPw, formNewPwConfirm, showEmptyMessage) {
  const newPwConfirmValue = formNewPwConfirm.value;
  const newPasswordValue = formNewPw.value;
  const newPwConfirmTxt = document.querySelector(
    ".passwordConfirm-helper-text",
  );

  if (newPwConfirmValue == "") {
    if (showEmptyMessage) {
      newPwConfirmTxt.textContent = "비밀번호를 한 번 더 입력해주세요.";
    } else {
      newPwConfirmTxt.textContent = "";
    }
    return false;
  } else if (newPasswordValue !== newPwConfirmValue) {
    newPwConfirmTxt.textContent = "*비밀번호와 다릅니다.";
    return false;
  } else {
    newPwConfirmTxt.textContent = "";
    return true;
  }
}

let isNewPasswordValid = false;
let isNewPwConfirmValid = false;

formNewPw.addEventListener("input", function () {
  isNewPasswordValid = validateNewPassword(formNewPw, false);
  if (formNewPwConfirm.value !== "") {
    isNewPwConfirmValid = validateNewPwConfirm(
      formNewPw,
      formNewPwConfirm,
      false,
    );
  }
  updateButtonState();
});

formNewPwConfirm.addEventListener("input", function () {
  isNewPasswordValid = validateNewPassword(formNewPw, false);
  isNewPwConfirmValid = validateNewPwConfirm(
    formNewPw,
    formNewPwConfirm,
    false,
  );
  updateButtonState();
});

async function fetchEditPassword() {
  const response = await authenticatedFetch(
    "http://localhost:8080/users/me/password",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: formCurrentPassword.value.trim(),
        new_password: formNewPw.value.trim(),
      }),
    },
  );
  if (!response) {
    return;
  }
  const result = await response.json();
  if (result.message === "password_update_success") {
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
