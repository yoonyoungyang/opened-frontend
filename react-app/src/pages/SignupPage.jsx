import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../features/auth/authApi";
import SignupForm from "../features/auth/SignupForm";

export default function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useMutation({ mutationFn: signup });

  async function handleSignup(user) {
    try {
      const response = await signupMutation.mutateAsync(user);

      if (response.message === "signup_success") {
        navigate("/login");
        return { success: true, fieldErrors: {} };
      }

      const fieldErrors = {};

      for (const error of response.errors ?? []) {
        if (error.code === "EMAIL_DUPLICATION") {
          fieldErrors.email = "이메일이 중복입니다.";
        }

        if (error.code === "NICKNAME_DUPLICATION") {
          fieldErrors.nickname = "닉네임이 중복입니다.";
        }
      }

      return { success: false, fieldErrors };
    } catch {
      return { success: false, fieldErrors: {} };
    }
  }

  return (
    <main className="main signup-page">
      <section className="signup-section">
        <h2 className="signup-title">회원가입</h2>
        <SignupForm
          onSubmit={handleSignup}
          isSubmitting={signupMutation.isPending}
        />
        <Link to="/login" className="login-link">
          로그인하러 가기
        </Link>
      </section>
    </main>
  );
}
