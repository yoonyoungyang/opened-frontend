const userId = localStorage.getItem("user_id");

const formEl = document.querySelector(".password-edit-form");

const formPw = document.querySelector("#password");
const formPwConfirm = document.querySelector("#password-confirm");
formPw.addEventListener("input", updateButtonState);
const submitEl = document.querySelector(".edit-button");

const toastMessage = document.querySelector(".toast-message");

function validatePassword(formPw, showEmptyMessage) {
  const currentPasswordValue = formPw.value;
  const currentPwConfirmValue = formPwConfirm.value;
  const regPas =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/;
  const pwHelpTxt = document.querySelector(".password-helper-text");

  if (currentPasswordValue == "") {
    if (showEmptyMessage) {
      pwHelpTxt.textContent = "비밀번호를 입력해주세요.";
    } else {
      pwHelpTxt.textContent = "";
    }
    return false;
  } else if (!regPas.test(currentPasswordValue)) {
    pwHelpTxt.textContent =
      "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    return false;
  }
  if (
    currentPwConfirmValue !== "" &&
    currentPasswordValue !== currentPwConfirmValue
  ) {
    pwHelpTxt.textContent = "*비밀번호 확인과 다릅니다.";
    return false;
  } else {
    pwHelpTxt.textContent = "";
    return true;
  }
}

function validatePwConfirm(formPw, formPwConfirm, showEmptyMessage) {
  const currentPwConfirmValue = formPwConfirm.value;
  const currentPasswordValue = formPw.value;
  const PwConfirmTxt = document.querySelector(".passwordConfirm-helper-text");

  if (currentPwConfirmValue == "") {
    if (showEmptyMessage) {
      PwConfirmTxt.textContent = "비밀번호를 한 번 더 입력해주세요.";
    } else {
      PwConfirmTxt.textContent = "";
    }
    return false;
  } else if (!(currentPasswordValue == currentPwConfirmValue)) {
    PwConfirmTxt.textContent = "*비밀번호가 다릅니다.";
    return false;
  } else if (currentPasswordValue !== currentPwConfirmValue) {
    PwConfirmTxt.textContent = "*비밀번호와 다릅니다.";
    return false;
  } else {
    PwConfirmTxt.textContent = "";
    return true;
  }
}

let isPasswordValid = false;
let isPwConfirmValid = false;

formPw.addEventListener("input", function () {
  isPasswordValid = validatePassword(formPw, false);
  if (formPwConfirm.value !== "") {
    isPwConfirmValid = validatePwConfirm(formPw, formPwConfirm, false);
  }
  updateButtonState();
});

formPwConfirm.addEventListener("input", function () {
  isPasswordValid = validatePassword(formPw, false);
  isPwConfirmValid = validatePwConfirm(formPw, formPwConfirm, false);
  updateButtonState();
});

function updateButtonState() {
  submitEl.disabled = !(isPasswordValid && isPwConfirmValid);
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  const isPasswordValid = validatePassword(formPw);

  if (isPasswordValid) {
    fetch("http://localhost:8080/users/me/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        current_password: formPw.value.trim(),
        new_password: formPw.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((result) => {
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
