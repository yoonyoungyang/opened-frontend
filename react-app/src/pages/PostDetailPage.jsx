import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import CommentSection from "../features/comments/CommentSection";
import { commentQueries } from "../features/comments/commentQueries";
import PostDetail from "../features/posts/PostDetail";
import { deletePost } from "../features/posts/postApi";
import { postQueries } from "../features/posts/postQueries";
import ConfirmDialog from "../shared/components/ConfirmDialog";
import ErrorState from "../shared/components/ErrorState";

export default function PostDetailPage() {
  const { postId } = useParams();
  const numericPostId = Number(postId);
  const isValidPostId = !Number.isNaN(numericPostId) && numericPostId > 0;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    ...postQueries.detail(numericPostId),
    enabled: isValidPostId,
  });
  const commentsQuery = useQuery({
    ...commentQueries.list(numericPostId),
    enabled: isValidPostId && postQuery.isSuccess,
  });
  const deleteMutation = useMutation({ mutationFn: () => deletePost(numericPostId) });

  async function handleDelete() {
    const response = await deleteMutation.mutateAsync();

    if (response.message === "post_delete_success") {
      setIsDeleteDialogOpen(false);
      queryClient.removeQueries({ queryKey: ["posts", numericPostId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/posts");
    }
  }

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
      <PostDetail
        post={postQuery.data}
        commentCount={commentCount}
        onEdit={() => navigate(`/posts/${numericPostId}/edit`)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
      <CommentSection comments={comments} />
      {isDeleteDialogOpen && (
        <ConfirmDialog
          title="게시글을 삭제하시겠습니까?"
          description="삭제한 내용은 복구 할 수 없습니다."
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}
