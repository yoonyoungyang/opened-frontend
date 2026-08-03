import defaultProfile from "../../../../assets/default-profile.png";
import { formatDate } from "../../shared/utils/formatDate";

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="cinema-ui-stat-icon">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="cinema-ui-stat-icon">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="cinema-ui-stat-icon">
      <path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2.2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v8Z" />
    </svg>
  );
}

export default function PostDetail({ post, commentCount }) {
  return (
    <article className="post">
      <header className="post-header">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-header-bottom">
          <div className="post-author-information">
            <span
              className="author-image"
              style={{
                backgroundImage: `url(${post.profile_img || defaultProfile})`,
              }}
            ></span>
            <span className="author-name">{post.nickname}</span>
            <time className="post-date" dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>
          </div>
          <div className="post-buttons">
            <button type="button" className="small-button" disabled={!post.is_mine}>
              수정
            </button>
            <button type="button" className="small-button" disabled={!post.is_mine}>
              삭제
            </button>
          </div>
        </div>
      </header>

      <section className="post-body">
        <div className="post-image" aria-label="게시글 이미지 영역"></div>
        <p className="post-text">{post.content}</p>
      </section>

      <section className="post-statistics" aria-label="게시글 통계">
        <button type="button" className="statistic-button">
          <HeartIcon />
          <strong>{post.like_count}</strong>
          <span>좋아요</span>
        </button>
        <div className="statistic-box">
          <ViewIcon />
          <strong>{post.view_count}</strong>
          <span>조회수</span>
        </div>
        <div className="statistic-box">
          <CommentIcon />
          <strong>{commentCount}</strong>
          <span>댓글</span>
        </div>
      </section>
    </article>
  );
}
