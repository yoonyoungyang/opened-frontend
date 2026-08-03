import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { hasAccessToken } from "../features/auth/tokenStorage";
import PostFilterView from "../features/posts/PostFilterView";
import PostList from "../features/posts/PostList";
import { postQueries } from "../features/posts/postQueries";

export default function PostsPage() {
  const navigate = useNavigate();
  const postsQuery = useQuery(postQueries.list());

  useEffect(() => {
    if (postsQuery.isError) {
      window.alert("서버 연결에 실패했습니다.");
    }
  }, [postsQuery.isError]);

  function handleCreatePost() {
    if (!hasAccessToken()) {
      window.alert("로그인하셔야 합니다.");
      navigate("/login");
      return;
    }

    navigate("/posts/new");
  }

  return (
    <main className="main posts-page">
      <section className="board-section">
        <div className="board-introduction">
          <p>인기 특별관 예매 정보를 가장 빠르게 나눠보세요.</p>
        </div>
        <PostFilterView />
        <div className="write-button-wrapper">
          <button type="button" className="write-button" onClick={handleCreatePost}>
            게시글 작성
          </button>
        </div>
        <h2 className="cinema-ui-post-list-title">게시글 목록</h2>
        <PostList posts={postsQuery.data ?? []} />
      </section>
    </main>
  );
}
