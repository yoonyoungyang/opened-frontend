const submitEl = document.querySelector(".login-button");

const formEl = document.forms[0];
const formId = document.querySelector("#email");
const formPw = document.querySelector("#password");

formId.addEventListener("input", updateButtonState);
formPw.addEventListener("input", updateButtonState);

const helpTxt = document.querySelector(".helper-text");

function validateEmail(formId) {
  const currentEmailValue = formId.value;

  const regEmail =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  if (currentEmailValue == "") {
    helpTxt.textContent = "이메일을 입력해주세요.";
    return false;
  } else if (!regEmail.test(currentEmailValue)) {
    helpTxt.textContent = "이메일은 이메일 형식으로 입력해 주세요.";
    return false;
  } else {
    helpTxt.textContent = "";
    return true;
  }
}

function validatePassword(formPw) {
  const currentPasswordValue = formPw.value;
  const regPas =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/;

  if (currentPasswordValue == "") {
    helpTxt.textContent = "비밀번호를 입력해주세요.";
    return false;
  } else if (!regPas.test(currentPasswordValue)) {
    helpTxt.textContent =
      "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    return false;
  } else {
    helpTxt.textContent = "";
    return true;
  }
}

function updateButtonState() {
  const isEmailValid = validateEmail(formId);
  if (!isEmailValid) {
    submitEl.disabled = true;
    return;
  }
  const isPasswordValid = validatePassword(formPw);

  submitEl.disabled = !isPasswordValid;
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  const isEmailValid = validateEmail(formId);
  const isPasswordValid = validatePassword(formPw);

  if (isEmailValid && isPasswordValid) {
    submitEl.textContent = "로그인 중...";
    fetch("http://localhost:8080/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formId.value.trim(),
        password: formPw.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "login_success") {
          localStorage.setItem("user_id", result.data.user_id);
          window.location.href = "/frontend/pages/posts.html";
        } else {
          helpTxt.innerHTML = "*아이디 또는 비밀번호를 확인해주세요.";
        }
      })
      .finally(() => {
        submitEl.textContent = "로그인";
        submitEl.disabled = false;
      });
  }
});
