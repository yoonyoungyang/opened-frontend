import { useState } from "react";
import { Link } from "react-router-dom";

import defaultProfile from "../assets/default-profile.png";
import { clearAccessToken } from "../features/auth/tokenStorage";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    clearAccessToken();
    setIsOpen(false);
  }

  return (
    <div className="profile-menu">
      <button
        type="button"
        className="profile-menu-button"
        aria-label="프로필 메뉴 열기"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <img
          src={defaultProfile}
          alt="프로필 이미지"
          className="header-profile-image"
        />
      </button>

      <nav className="profile-dropdown" hidden={!isOpen}>
        <Link
          to="/profile/edit"
          className="profile-dropdown-item edit-user-info"
        >
          회원정보수정
        </Link>
        <Link
          to="/profile/password"
          className="profile-dropdown-item edit-password"
        >
          비밀번호수정
        </Link>
        <Link
          to="/login"
          className="profile-dropdown-item logout"
          onClick={handleLogout}
        >
          로그아웃
        </Link>
      </nav>
    </div>
  );
}
