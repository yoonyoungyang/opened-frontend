import { validatePassword } from "../auth/authValidation.js";

export function validateCurrentPassword(value, showEmptyMessage = true) {
  if (!value) {
    return {
      isValid: false,
      message: showEmptyMessage ? "비밀번호를 입력해주세요." : "",
    };
  }

  return { isValid: true, message: "" };
}

export function validateNewPassword(
  password,
  passwordConfirm,
  showEmptyMessage = true,
) {
  const passwordValidation = validatePassword(password, showEmptyMessage);

  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  if (passwordConfirm !== "" && password !== passwordConfirm) {
    return {
      isValid: false,
      message: "*비밀번호 확인과 다릅니다.",
    };
  }

  return { isValid: true, message: "" };
}

export function validateNewPasswordConfirm(
  password,
  passwordConfirm,
  showEmptyMessage = true,
) {
  if (passwordConfirm === "") {
    return {
      isValid: false,
      message: showEmptyMessage ? "비밀번호를 한 번 더 입력해주세요." : "",
    };
  }

  if (password !== passwordConfirm) {
    return { isValid: false, message: "*비밀번호와 다릅니다." };
  }

  return { isValid: true, message: "" };
}
