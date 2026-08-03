import { useState } from "react";

import { validateEmail, validatePassword } from "./authValidation";

export default function LoginForm({ onSubmit, isSubmitting }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [helperText, setHelperText] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  function handleEmailChange(event) {
    const nextEmail = event.target.value;
    const emailValidation = validateEmail(nextEmail);

    setEmail(nextEmail);
    setIsEmailValid(emailValidation.isValid);
    setHelperText(emailValidation.message);

    if (emailValidation.isValid) {
      const passwordValidation = validatePassword(password);
      setIsPasswordValid(passwordValidation.isValid);
      setHelperText(passwordValidation.message);
    }
  }

  function handlePasswordChange(event) {
    const nextPassword = event.target.value;
    const emailValidation = validateEmail(email);

    setPassword(nextPassword);
    setIsEmailValid(emailValidation.isValid);
    setHelperText(emailValidation.message);

    if (emailValidation.isValid) {
      const passwordValidation = validatePassword(nextPassword);
      setIsPasswordValid(passwordValidation.isValid);
      setHelperText(passwordValidation.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setHelperText(emailValidation.message);
      return;
    }

    if (!passwordValidation.isValid) {
      setHelperText(passwordValidation.message);
      return;
    }

    const result = await onSubmit({
      email: email.trim(),
      password: password.trim(),
    });

    if (!result.success) {
      setHelperText("*아이디 또는 비밀번호를 확인해주세요.");
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="email" className="input-label">
          이메일
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="input-field"
          placeholder="이메일을 입력하세요"
          autoComplete="email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="password" className="input-label">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="input-field"
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          aria-describedby="login-helper"
          aria-invalid={Boolean(helperText)}
          value={password}
          onChange={handlePasswordChange}
        />
        <p id="login-helper" className="helper-text">
          {helperText}
        </p>
      </div>

      <button
        type="submit"
        className="login-button"
        disabled={!isEmailValid || !isPasswordValid || isSubmitting}
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
