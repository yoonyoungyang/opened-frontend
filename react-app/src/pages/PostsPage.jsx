import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { hasAccessToken } from "../features/auth/tokenStorage";
import PostFilterView from "../features/posts/PostFilterView";
import PostList from "../features/posts/PostList";
import {
  DEFAULT_POST_FILTERS,
  filterPosts,
} from "../features/posts/postFilter";
import { postQueries } from "../features/posts/postQueries";

export default function PostsPage() {
  const navigate = useNavigate();
  const postsQuery = useQuery(postQueries.list());
  const [draftFilters, setDraftFilters] = useState(DEFAULT_POST_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_POST_FILTERS);

  const filteredPosts = useMemo(
    () => filterPosts(postsQuery.data ?? [], appliedFilters),
    [postsQuery.data, appliedFilters],
  );

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

  function handleResetFilters() {
    setDraftFilters(DEFAULT_POST_FILTERS);
    setAppliedFilters(DEFAULT_POST_FILTERS);
  }

  return (
    <main className="main posts-page">
      <section className="board-section">
        <div className="board-introduction">
          <p>인기 특별관 예매 정보를 가장 빠르게 나눠보세요.</p>
        </div>
        <PostFilterView
          filters={draftFilters}
          onChange={setDraftFilters}
          onReset={handleResetFilters}
          onSubmit={() => setAppliedFilters(draftFilters)}
        />
        <div className="write-button-wrapper">
          <button type="button" className="write-button" onClick={handleCreatePost}>
            게시글 작성
          </button>
        </div>
        <h2 className="cinema-ui-post-list-title">게시글 목록</h2>
        <PostList posts={filteredPosts} />
      </section>
    </main>
  );
}
