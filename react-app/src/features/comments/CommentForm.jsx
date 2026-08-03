import { useState } from "react";

export default function CommentForm({ editingComment, onSubmit }) {
  const [content, setContent] = useState(
    editingComment ? editingComment.content.trim() : "",
  );

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    const isSuccess = await onSubmit(trimmedContent);

    if (isSuccess && !editingComment) {
      setContent("");
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-input"
        name="comment"
        placeholder="댓글을 남겨주세요!"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      ></textarea>
      <div className="comment-submit-area">
        <button
          type="submit"
          className="comment-submit-button"
          disabled={!content.trim()}
        >
          {editingComment ? "댓글 수정" : "댓글 등록"}
        </button>
      </div>
    </form>
  );
}
