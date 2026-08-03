import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../features/auth/authApi";
import LoginForm from "../features/auth/LoginForm";
import { setAccessToken } from "../features/auth/tokenStorage";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useMutation({ mutationFn: login });

  async function handleLogin(credentials) {
    try {
      const response = await loginMutation.mutateAsync(credentials);

      if (response.message !== "login_success") {
        return { success: false };
      }

      setAccessToken(response.data.token);
      navigate("/posts");
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  return (
    <main className="main login-page">
      <section className="login-section">
        <h2 className="login-title">로그인</h2>
        <LoginForm
          onSubmit={handleLogin}
          isSubmitting={loginMutation.isPending}
        />
        <Link to="/signup" className="signup-link">
          회원가입
        </Link>
      </section>
    </main>
  );
}
