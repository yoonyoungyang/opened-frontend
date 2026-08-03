export const EMAIL_PATTERN =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/;

export function validateEmail(value, showEmptyMessage = true) {
  if (value === "") {
    return {
      isValid: false,
      message: showEmptyMessage ? "이메일을 입력해주세요." : "",
    };
  }

  if (!EMAIL_PATTERN.test(value)) {
    return {
      isValid: false,
      message: "이메일은 이메일 형식으로 입력해 주세요.",
    };
  }

  return { isValid: true, message: "" };
}

export function validatePassword(value, showEmptyMessage = true) {
  if (value === "") {
    return {
      isValid: false,
      message: showEmptyMessage ? "비밀번호를 입력해주세요." : "",
    };
  }

  if (!PASSWORD_PATTERN.test(value)) {
    return {
      isValid: false,
      message:
        "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.",
    };
  }

  return { isValid: true, message: "" };
}

export function validatePasswordConfirm(
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
    return { isValid: false, message: "*비밀번호가 다릅니다." };
  }

  return { isValid: true, message: "" };
}

export function validateNickname(value, showEmptyMessage = true) {
  if (value === "") {
    return {
      isValid: false,
      message: showEmptyMessage ? "닉네임을 입력해주세요." : "",
    };
  }

  if (value.length > 10) {
    return {
      isValid: false,
      message: "*닉네임은 최대 10자까지 작성 가능합니다.",
    };
  }

  if (value.includes(" ")) {
    return { isValid: false, message: "*띄어쓰기를 없애주세요." };
  }

  return { isValid: true, message: "" };
}
