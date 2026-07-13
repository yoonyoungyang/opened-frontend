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
