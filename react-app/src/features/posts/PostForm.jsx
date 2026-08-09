import { useState } from "react";

import { CINEMA_OPTIONS, POST_TYPE_OPTIONS } from "./postFilter";
import { limitPostTitle, validatePost } from "./postValidation";

function PostSettingsView({ mode, settings, onChange }) {
  function handleChange(event) {
    onChange({
      ...settings,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div className="cinema-ui-post-settings">
      <div className="cinema-ui-setting-group">
        <span className="form-label">게시글 유형</span>
        <div className="cinema-ui-type-options">
          {POST_TYPE_OPTIONS.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="postType"
                value={option.value}
                checked={settings.postType === option.value}
                onChange={handleChange}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="cinema-ui-setting-row">
        <label className="cinema-ui-setting-field">
          <span className="form-label">상영관</span>
          <select name="cinema" value={settings.cinema} onChange={handleChange}>
            <option value="">상영관을 선택하세요</option>
            {CINEMA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="cinema-ui-setting-field">
          <span className="form-label">영화명</span>
          <input
            type="text"
            name="movieName"
            placeholder="영화명을 입력하세요"
            value={settings.movieName}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="cinema-ui-extra-fields cinema-ui-extra-open">
        <label>
          <span>오픈된 상영 시작일</span>
          <input type="date" />
        </label>
        <label>
          <span>오픈된 상영 종료일</span>
          <input type="date" />
        </label>
      </div>
      <div className="cinema-ui-extra-fields cinema-ui-extra-cancel">
        <label>
          <span>상영 일시</span>
          <input type="datetime-local" />
        </label>
        <label>
          <span>좌석 정보</span>
          <input type="text" placeholder="예: G열 12번" />
        </label>
      </div>
      <div className="cinema-ui-extra-fields cinema-ui-extra-seat">
        <label>
          <span>좌석 정보</span>
          <input type="text" placeholder="예: F열 중앙" />
        </label>
        <label>
          <span>{mode === "edit" ? "시야 만족도" : "만족도"}</span>
          <select defaultValue="★★★★★">
            <option>★★★★★</option>
            <option>★★★★☆</option>
            <option>★★★☆☆</option>
            <option>★★☆☆☆</option>
            <option>★☆☆☆☆</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default function PostForm({
  mode,
  initialTitle = "",
  initialContent = "",
  initialCinema = "",
  initialMovieName = "",
  initialPostType = "OPEN",
  onSubmit,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [settings, setSettings] = useState({
    cinema: initialCinema ?? "",
    movieName: initialMovieName ?? "",
    postType: initialPostType ?? "OPEN",
  });
  const [helperText, setHelperText] = useState("");

  const validation = validatePost(title, content, settings);
  const hasChanged =
    title !== initialTitle ||
    content !== initialContent ||
    settings.cinema !== (initialCinema ?? "") ||
    settings.movieName !== (initialMovieName ?? "") ||
    settings.postType !== (initialPostType ?? "OPEN");
  const isSubmitEnabled = validation.isValid && (mode === "create" || hasChanged);

  function handleTitleChange(event) {
    const nextTitle = limitPostTitle(event.target.value);
    setTitle(nextTitle);
    setHelperText(validatePost(nextTitle, content, settings).message);
  }

  function handleContentChange(event) {
    const nextContent = event.target.value;
    setContent(nextContent);
    setHelperText(validatePost(title, nextContent, settings).message);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const currentValidation = validatePost(title, content, settings);
    setHelperText(currentValidation.message);

    if (!currentValidation.isValid || (mode === "edit" && !hasChanged)) {
      return;
    }

    await onSubmit({
      title,
      content,
      cinema: settings.cinema,
      movie_name: settings.movieName.trim(),
      post_type: settings.postType,
    });
  }

  return (
    <form
      className={mode === "create" ? "create-form" : "edit-form"}
      onSubmit={handleSubmit}
    >
      <PostSettingsView mode={mode} settings={settings} onChange={setSettings} />

      <div className="form-group">
        <label htmlFor="post-title" className="form-label">
          제목<span aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="post-title"
          name="title"
          className="title-input"
          placeholder={
            mode === "create" ? "제목을 입력해주세요. (최대 26글자)" : undefined
          }
          maxLength={26}
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="form-group content-group">
        <label htmlFor="post-content" className="form-label">
          내용<span aria-hidden="true">*</span>
        </label>
        <textarea
          id="post-content"
          name="content"
          className="content-input"
          placeholder={mode === "create" ? "내용을 입력해주세요." : undefined}
          value={content}
          onChange={handleContentChange}
        ></textarea>
        <p className="helper-text">{helperText}</p>
      </div>

      <div className={`form-group ${mode === "create" ? "image-group" : ""}`}>
        <span className="form-label">이미지</span>
        <div className="file-area">
          <label htmlFor="post-image" className="file-button">
            파일 선택
          </label>
          <input
            type="file"
            id="post-image"
            name="image"
            className="file-input"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          />
          <span className="file-name">
            {mode === "create" ? "파일을 선택해주세요." : "기존 파일 명"}
          </span>
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={!isSubmitEnabled}>
        {mode === "create" ? "완료" : "수정하기"}
      </button>
    </form>
  );
}
