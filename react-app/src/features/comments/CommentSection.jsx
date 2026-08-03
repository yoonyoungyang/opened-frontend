import CommentList from "./CommentList";

export default function CommentSection({ comments }) {
  return (
    <section className="comment-section">
      <form className="comment-form">
        <textarea
          className="comment-input"
          name="comment"
          placeholder="댓글을 남겨주세요!"
        ></textarea>
        <div className="comment-submit-area">
          <button type="submit" className="comment-submit-button" disabled>
            댓글 등록
          </button>
        </div>
      </form>
      <CommentList comments={comments} />
    </section>
  );
}
