import { useNavigate } from "react-router-dom";

import PostCard from "./PostCard";

export default function PostList({ posts }) {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return <p className="post-list-empty">조건에 맞는 게시글이 없습니다.</p>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.post_id}
          post={post}
          onClick={() => navigate(`/posts/${post.post_id}`)}
        />
      ))}
    </div>
  );
}
