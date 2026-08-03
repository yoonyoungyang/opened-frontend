import defaultProfile from "../../assets/default-profile.png";
import { formatDate } from "../../shared/utils/formatDate";

export default function PostCard({ post, onClick }) {
  return (
    <article className="post-card" onClick={onClick}>
      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-information">
          <div className="post-counts">
            <span>좋아요 {post.like_count}</span>
            <span>댓글 {post.comment_count}</span>
            <span>조회수 {post.view_count}</span>
          </div>
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        </div>
      </div>
      <div className="post-author">
        <img
          className="author-image"
          src={post.profile_img || defaultProfile}
          alt=""
        />
        <span className="author-name">{post.nickname}</span>
      </div>
    </article>
  );
}
