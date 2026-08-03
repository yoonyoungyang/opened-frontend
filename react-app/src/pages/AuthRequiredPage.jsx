import { Link } from "react-router-dom";

export default function AuthRequiredPage() {
  return (
    <main className="main auth-required-page">
      <section className="cinema-ui-auth-required">
        <span className="cinema-ui-auth-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <h2>로그인이 필요합니다</h2>
        <p>게시글 작성은 로그인 후 이용할 수 있어요.</p>
        <Link to="/login" className="cinema-ui-auth-primary">
          로그인하기
        </Link>
        <Link to="/posts" className="cinema-ui-auth-secondary">
          게시판으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
