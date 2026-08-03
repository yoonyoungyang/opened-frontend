import { Link, useNavigate } from "react-router-dom";

import ProfileMenu from "./ProfileMenu";

export default function Header({ showBackButton, backLabel, profile }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-inner">
        {showBackButton && (
          <button
            type="button"
            className="back-button"
            aria-label={backLabel}
            onClick={() => navigate(-1)}
          >
            ‹
          </button>
        )}

        <h1 className="header-title">열렸나요</h1>

        <nav className="cinema-ui-header-nav" aria-label="주요 메뉴">
          <Link to="/posts" className="cinema-ui-header-link">
            게시판
          </Link>
        </nav>

        {profile === "menu" && <ProfileMenu />}
      </div>
    </header>
  );
}
