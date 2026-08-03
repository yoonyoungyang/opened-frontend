import { useState } from "react";

import {
  validateCurrentPassword,
  validateNewPassword,
  validateNewPasswordConfirm,
} from "./passwordValidation";

const INITIAL_VALIDITY = {
  currentPassword: false,
  newPassword: false,
  passwordConfirm: false,
};

const INITIAL_ERRORS = {
  currentPassword: "",
  newPassword: "",
  passwordConfirm: "",
};

export default function PasswordEditForm({ onSubmit }) {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    passwordConfirm: "",
  });
  const [validity, setValidity] = useState(INITIAL_VALIDITY);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  function handleCurrentPasswordChange(event) {
    const currentPassword = event.target.value;
    const validation = validateCurrentPassword(currentPassword, true);

    setValues((current) => ({ ...current, currentPassword }));
    setValidity((current) => ({
      ...current,
      currentPassword: validation.isValid,
    }));
    setErrors((current) => ({
      ...current,
      currentPassword: validation.message,
    }));
  }

  function handleNewPasswordChange(event) {
    const newPassword = event.target.value;
    const currentPasswordValidation = validateCurrentPassword(
      values.currentPassword,
      true,
    );
    const newPasswordValidation = validateNewPassword(
      newPassword,
      values.passwordConfirm,
      false,
    );
    const confirmValidation =
      values.passwordConfirm === ""
        ? { isValid: validity.passwordConfirm, message: errors.passwordConfirm }
        : validateNewPasswordConfirm(newPassword, values.passwordConfirm, false);

    setValues((current) => ({ ...current, newPassword }));
    setValidity((current) => ({
      ...current,
      currentPassword: currentPasswordValidation.isValid,
      newPassword: newPasswordValidation.isValid,
      passwordConfirm: confirmValidation.isValid,
    }));
    setErrors((current) => ({
      ...current,
      currentPassword: currentPasswordValidation.message,
      newPassword: newPasswordValidation.message,
      passwordConfirm: confirmValidation.message,
    }));
  }

  function handlePasswordConfirmChange(event) {
    const passwordConfirm = event.target.value;
    const currentPasswordValidation = validateCurrentPassword(
      values.currentPassword,
      true,
    );
    const newPasswordValidation = validateNewPassword(
      values.newPassword,
      passwordConfirm,
      false,
    );
    const confirmValidation = validateNewPasswordConfirm(
      values.newPassword,
      passwordConfirm,
      false,
    );

    setValues((current) => ({ ...current, passwordConfirm }));
    setValidity((current) => ({
      ...current,
      currentPassword: currentPasswordValidation.isValid,
      newPassword: newPasswordValidation.isValid,
      passwordConfirm: confirmValidation.isValid,
    }));
    setErrors((current) => ({
      ...current,
      currentPassword: currentPasswordValidation.message,
      newPassword: newPasswordValidation.message,
      passwordConfirm: confirmValidation.message,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!Object.values(validity).every(Boolean)) {
      return;
    }

    onSubmit({
      current_password: values.currentPassword.trim(),
      new_password: values.newPassword.trim(),
    });
  }

  return (
    <form className="password-edit-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="current-password" className="form-label">
          현재 비밀번호
        </label>
        <input
          type="password"
          id="current-password"
          name="currentPassword"
          className="form-input"
          placeholder="현재 비밀번호를 입력하세요"
          autoComplete="current-password"
          value={values.currentPassword}
          onChange={handleCurrentPasswordChange}
        />
        <p className="current-password-helper-text helper-text">
          {errors.currentPassword}
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="new-password" className="form-label">
          새 비밀번호
        </label>
        <input
          type="password"
          id="new-password"
          name="newPassword"
          className="form-input"
          placeholder="새 비밀번호를 입력하세요"
          autoComplete="new-password"
          value={values.newPassword}
          onChange={handleNewPasswordChange}
        />
        <p className="new-password-helper-text helper-text">
          {errors.newPassword}
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="password-confirm" className="form-label">
          새 비밀번호 확인
        </label>
        <input
          type="password"
          id="password-confirm"
          name="passwordConfirm"
          className="form-input"
          placeholder="새 비밀번호를 한 번 더 입력하세요"
          autoComplete="new-password"
          value={values.passwordConfirm}
          onChange={handlePasswordConfirmChange}
        />
        <p className="passwordConfirm-helper-text helper-text">
          {errors.passwordConfirm}
        </p>
      </div>

      <button
        type="submit"
        className="edit-button"
        disabled={!Object.values(validity).every(Boolean)}
      >
        수정하기
      </button>
    </form>
  );
}
