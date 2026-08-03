import defaultProfile from "../../../../assets/default-profile.png";
import { formatDate } from "../../shared/utils/formatDate";

export default function CommentItem({ comment }) {
  return (
    <article className="comment">
      <div className="comment-top">
        <div className="comment-author-information">
          <span
            className="comment-author-image"
            style={{
              backgroundImage: `url(${comment.profile_img || defaultProfile})`,
            }}
          ></span>
          <div className="comment-author-text">
            <div className="comment-author-row">
              <strong className="comment-author-name">{comment.nickname}</strong>
              <time className="comment-date" dateTime={comment.created_at}>
                {formatDate(comment.created_at)}
              </time>
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        </div>
        {comment.is_mine && (
          <div className="comment-buttons">
            <button type="button" className="small-button">
              수정
            </button>
            <button type="button" className="small-button">
              삭제
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
