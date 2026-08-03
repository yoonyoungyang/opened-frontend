import { useNavigate } from "react-router-dom";

import PostCard from "./PostCard";

export default function PostList({ posts }) {
  const navigate = useNavigate();

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
