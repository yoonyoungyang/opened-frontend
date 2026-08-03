import { useState } from "react";

import defaultProfile from "../../assets/default-profile.png";

export default function ProfileEditForm({ profile, onSubmit, onWithdraw }) {
  const [nickname, setNickname] = useState(profile.nickname);

  function handleSubmit(event) {
    event.preventDefault();

    if (nickname === profile.nickname) {
      window.alert("변경된 사항이 없습니다.");
      return;
    }

    onSubmit({
      nickname,
      profile_img: profile.profile_img,
    });
  }

  return (
    <form className="profile-edit-form" onSubmit={handleSubmit}>
      <div className="profile-image-group">
        <span className="form-label profile-label">
          프로필 사진<span aria-hidden="true">*</span>
        </span>
        <label htmlFor="profile-image-input" className="profile-image-label">
          <img
            src={defaultProfile}
            alt="현재 프로필 이미지"
            className="profile-image-preview"
          />
          <span className="profile-image-overlay">변경</span>
        </label>
        <input
          type="file"
          id="profile-image-input"
          name="profileImage"
          className="visually-hidden"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        />
      </div>

      <div className="form-group">
        <span className="form-label">이메일</span>
        <p className="email-value">{profile.email}</p>
      </div>

      <div className="form-group nickname-group">
        <label htmlFor="nickname" className="form-label">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          className="nickname-input"
          maxLength={10}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
        <p className="helper-text"></p>
      </div>

      <button type="submit" className="edit-button">
        수정하기
      </button>
      <button type="button" className="withdraw-button" onClick={onWithdraw}>
        회원 탈퇴
      </button>
    </form>
  );
}
