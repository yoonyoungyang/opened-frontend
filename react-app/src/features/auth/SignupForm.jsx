import { useState } from "react";

import defaultProfile from "../../../../assets/default-profile.png";
import FormField from "../../shared/components/FormField";
import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from "./authValidation";

const INITIAL_VALIDITY = {
  email: false,
  password: false,
  passwordConfirm: false,
  nickname: false,
};

const INITIAL_ERRORS = {
  email: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
};

export default function SignupForm({ onSubmit, isSubmitting }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [validity, setValidity] = useState(INITIAL_VALIDITY);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  function updateField(name, value, validation) {
    setValues((current) => ({ ...current, [name]: value }));
    setValidity((current) => ({
      ...current,
      [name]: validation.isValid,
    }));
    setErrors((current) => ({ ...current, [name]: validation.message }));
  }

  function handleEmailChange(event) {
    const value = event.target.value;
    updateField("email", value, validateEmail(value, false));
  }

  function handlePasswordChange(event) {
    const value = event.target.value;
    updateField("password", value, validatePassword(value, false));
  }

  function handlePasswordConfirmChange(event) {
    const value = event.target.value;
    updateField(
      "passwordConfirm",
      value,
      validatePasswordConfirm(values.password, value, false),
    );
  }

  function handleNicknameChange(event) {
    const value = event.target.value;
    updateField("nickname", value, validateNickname(value, false));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationResults = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      passwordConfirm: validatePasswordConfirm(
        values.password,
        values.passwordConfirm,
      ),
      nickname: validateNickname(values.nickname),
    };
    const nextValidity = Object.fromEntries(
      Object.entries(validationResults).map(([key, result]) => [
        key,
        result.isValid,
      ]),
    );

    setValidity(nextValidity);
    setErrors(
      Object.fromEntries(
        Object.entries(validationResults).map(([key, result]) => [
          key,
          result.message,
        ]),
      ),
    );

    if (!Object.values(nextValidity).every(Boolean)) {
      return;
    }

    const result = await onSubmit({
      email: values.email.trim(),
      password: values.password.trim(),
      nickname: values.nickname.trim(),
    });

    if (!result.success) {
      setErrors((current) => ({ ...current, ...result.fieldErrors }));
    }
  }

  const isFormValid = Object.values(validity).every(Boolean);

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="profile-group">
        <span className="form-label">
          프로필 사진<span aria-hidden="true">*</span>
        </span>
        <p className="profile-helper-text"></p>
        <label
          htmlFor="profile-image"
          className="profile-image-label"
          aria-label="프로필 사진 선택"
        >
          <span className="profile-image-preview">
            <img
              src={defaultProfile}
              alt="기본 프로필 이미지"
              className="profile-preview-image"
            />
            <span className="plus-icon"></span>
          </span>
        </label>
        <input
          type="file"
          id="profile-image"
          name="profileImage"
          className="visually-hidden"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        />
      </div>

      <FormField
        id="email"
        name="email"
        type="email"
        label="이메일"
        placeholder="이메일을 입력하세요"
        autoComplete="email"
        required
        value={values.email}
        helperText={errors.email}
        onChange={handleEmailChange}
      />
      <FormField
        id="password"
        name="password"
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        autoComplete="new-password"
        required
        value={values.password}
        helperText={errors.password}
        onChange={handlePasswordChange}
      />
      <FormField
        id="password-confirm"
        name="passwordConfirm"
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 한번 더 입력하세요"
        autoComplete="new-password"
        required
        value={values.passwordConfirm}
        helperText={errors.passwordConfirm}
        onChange={handlePasswordConfirmChange}
      />
      <FormField
        id="nickname"
        name="nickname"
        type="text"
        label="닉네임"
        placeholder="닉네임을 입력하세요"
        maxLength={10}
        required
        containerClassName="nickname-group"
        value={values.nickname}
        helperText={errors.nickname}
        onChange={handleNicknameChange}
      />

      <button
        type="submit"
        className="signup-button"
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? "회원가입 중..." : "회원가입"}
      </button>
    </form>
  );
}
