const formEl = document.querySelector(".signup-form");
const submitEl = document.querySelector(".signup-button");

const formEmail = document.querySelector("#email");
const formPw = document.querySelector("#password");
const formPwConfirm = document.querySelector("#password-confirm");
const formNickname = document.querySelector("#nickname");

function validateEmail(formEmail, showEmptyMessage) {
  const currentEmailValue = formEmail.value;

  const regEmail =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  const emailHelperTxt = document.querySelector(".email-helper-text");

  if (currentEmailValue == "") {
    if (showEmptyMessage) {
      emailHelperTxt.textContent = "이메일을 입력해주세요.";
    } else {
      emailHelperTxt.textContent = "";
    }
    return false;
  } else if (!regEmail.test(currentEmailValue)) {
    emailHelperTxt.textContent = "이메일은 이메일 형식으로 입력해 주세요.";
    return false;
  } else {
    emailHelperTxt.textContent = "";
    return true;
  }
}

function validatePassword(formPw, showEmptyMessage) {
  const currentPasswordValue = formPw.value;
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
  } else {
    pwHelpTxt.textContent = "";
    return true;
  }
}

function validatePwConfirm(formPw, formPwConfirm, showEmptyMessage) {
  const currentPwConfirmValue = formPwConfirm.value;
  const currentPasswordValue = formPw.value;
  const PwConfirmTxt = document.querySelector(".password-confirm-helper-text");

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
  } else {
    PwConfirmTxt.textContent = "";
    return true;
  }
}

function validateNickname(formNickname, showEmptyMessage) {
  const currentNickname = formNickname.value;
  const nickHelpTxt = document.querySelector(".nickname-helper-text");
  if (currentNickname == "") {
    if (showEmptyMessage) {
      nickHelpTxt.textContent = "닉네임을 입력해주세요.";
    } else {
      nickHelpTxt.textContent = "";
    }
    return false;
  } else if (currentNickname.length > 10) {
    nickHelpTxt.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
    return false;
  } else if (currentNickname.includes(" ")) {
    nickHelpTxt.textContent = "*띄어쓰기를 없애주세요.";
    return false;
  } else {
    nickHelpTxt.textContent = "";
    return true;
  }
}

let isEmailValid = false;
let isPasswordValid = false;
let isNicknameValid = false;
let isPwConfirmValid = false;

formEmail.addEventListener("input", function () {
  isEmailValid = validateEmail(formEmail, false);
  updateButtonState();
});

formPw.addEventListener("input", function () {
  isPasswordValid = validatePassword(formPw, false);
  updateButtonState();
});

formNickname.addEventListener("input", function () {
  isNicknameValid = validateNickname(formNickname, false);
  updateButtonState();
});

formPwConfirm.addEventListener("input", function () {
  isPwConfirmValid = validatePwConfirm(formPw, formPwConfirm, false);
  updateButtonState();
});

function updateButtonState() {
  submitEl.disabled = !(
    isEmailValid &&
    isPasswordValid &&
    isNicknameValid &&
    isPwConfirmValid
  );
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  const isEmailValid = validateEmail(formEmail, true);
  const isPasswordValid = validatePassword(formPw, true);
  const isNicknameValid = validateNickname(formNickname, true);
  const isPwConfirmValid = validatePwConfirm(formPw, formPwConfirm, true);

  if (isEmailValid && isPasswordValid && isNicknameValid && isPwConfirmValid) {
    submitEl.textContent = "회원가입 중...";
    fetch("http://localhost:8080/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formEmail.value.trim(),
        password: formPw.value.trim(),
        nickname: formNickname.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "signup_success") {
          window.location.href = "/frontend/pages/login.html";
        } else {
          result.errors.forEach((error) => {
            const emailHelperTxt = document.querySelector(".email-helper-text");
            const nickHelpTxt = document.querySelector(".nickname-helper-text");
            if (error.code === "EMAIL_DUPLICATION") {
              emailHelperTxt.textContent = "이메일이 중복입니다.";
            } else if (error.code === "NICKNAME_DUPLICATION") {
              nickHelpTxt.textContent = "닉네임이 중복입니다.";
            } else {
              emailHelperTxt = "";
              nickHelpTxt = "";
            }
          });
        }
      })
      .finally(() => {
        submitEl.textContent = "회원가입";
        submitEl.disabled = false;
      });
  }
});
