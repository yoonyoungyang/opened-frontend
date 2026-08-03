import { useState } from "react";

import { limitPostTitle, validatePost } from "./postValidation";

function PostSettingsView({ mode }) {
  return (
    <div className="cinema-ui-post-settings">
      <div className="cinema-ui-setting-group">
        <span className="form-label">게시글 유형</span>
        <div className="cinema-ui-type-options">
          <label>
            <input type="radio" name="cinemaPostType" value="OPEN" defaultChecked />
            <span>예매 오픈</span>
          </label>
          <label>
            <input type="radio" name="cinemaPostType" value="CANCEL" />
            <span>취소표</span>
          </label>
          <label>
            <input type="radio" name="cinemaPostType" value="SEAT" />
            <span>좌석 후기</span>
          </label>
          <label>
            <input type="radio" name="cinemaPostType" value="QUESTION" />
            <span>질문</span>
          </label>
        </div>
      </div>

      <div className="cinema-ui-setting-row">
        <label className="cinema-ui-setting-field">
          <span className="form-label">상영관</span>
          <select defaultValue="상영관을 선택하세요">
            <option>상영관을 선택하세요</option>
            <option>용산 아이파크몰 IMAX</option>
            <option>왕십리 IMAX</option>
            <option>여의도 4DX</option>
            <option>코엑스 Dolby Cinema</option>
            <option>월드타워 수퍼플렉스</option>
          </select>
        </label>
        <label className="cinema-ui-setting-field">
          <span className="form-label">영화명</span>
          <input type="text" placeholder="영화명을 입력하세요" />
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
  onSubmit,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [helperText, setHelperText] = useState("");

  const validation = validatePost(title, content);
  const hasChanged = title !== initialTitle || content !== initialContent;
  const isSubmitEnabled = validation.isValid && (mode === "create" || hasChanged);

  function handleTitleChange(event) {
    const nextTitle = limitPostTitle(event.target.value);
    setTitle(nextTitle);
    setHelperText(validatePost(nextTitle, content).message);
  }

  function handleContentChange(event) {
    const nextContent = event.target.value;
    setContent(nextContent);
    setHelperText(validatePost(title, nextContent).message);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const currentValidation = validatePost(title, content);
    setHelperText(currentValidation.message);

    if (!currentValidation.isValid || (mode === "edit" && !hasChanged)) {
      return;
    }

    await onSubmit({ title, content });
  }

  return (
    <form
      className={mode === "create" ? "create-form" : "edit-form"}
      onSubmit={handleSubmit}
    >
      <PostSettingsView mode={mode} />

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
