import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import CommentSection from "../features/comments/CommentSection";
import { commentQueries } from "../features/comments/commentQueries";
import PostDetail from "../features/posts/PostDetail";
import { postQueries } from "../features/posts/postQueries";
import ErrorState from "../shared/components/ErrorState";

export default function PostDetailPage() {
  const { postId } = useParams();
  const numericPostId = Number(postId);
  const isValidPostId = !Number.isNaN(numericPostId) && numericPostId > 0;
  const postQuery = useQuery({
    ...postQueries.detail(numericPostId),
    enabled: isValidPostId,
  });
  const commentsQuery = useQuery({
    ...commentQueries.list(numericPostId),
    enabled: isValidPostId && postQuery.isSuccess,
  });

  if (!isValidPostId || postQuery.isError) {
    return (
      <main className="main post-detail-page">
        <ErrorState />
      </main>
    );
  }

  if (!postQuery.data) {
    return <main className="main post-detail-page"></main>;
  }

  const comments = commentsQuery.data?.comments ?? [];
  const commentCount = commentsQuery.data?.total_count ?? postQuery.data.comment_count;

  return (
    <main className="main post-detail-page">
      <PostDetail post={postQuery.data} commentCount={commentCount} />
      <CommentSection comments={comments} />
    </main>
  );
}
