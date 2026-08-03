import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import CommentSection from "../features/comments/CommentSection";
import { deleteComment } from "../features/comments/commentApi";
import { commentQueries } from "../features/comments/commentQueries";
import PostDetail from "../features/posts/PostDetail";
import { postQueries } from "../features/posts/postQueries";
import ConfirmDialog from "../shared/components/ConfirmDialog";
import ErrorState from "../shared/components/ErrorState";
import { createLike, deleteLike, deletePost } from "../features/posts/postApi";

export default function PostDetailPage() {
  const { postId } = useParams();
  const numericPostId = Number(postId);
  const isValidPostId = !Number.isNaN(numericPostId) && numericPostId > 0;
  const [deleteTarget, setDeleteTarget] = useState(null);
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
  const deleteMutation = useMutation({
    mutationFn: () => deletePost(numericPostId),
  });
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => deleteComment(numericPostId, commentId),
  });
  const createLikeMutation = useMutation({
    mutationFn: () => createLike(numericPostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", numericPostId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteLikeMutation = useMutation({
    mutationFn: () => deleteLike(numericPostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", numericPostId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  async function handleDeletePost() {
    const response = await deleteMutation.mutateAsync();

    if (response.message === "post_delete_success") {
      setDeleteTarget(null);
      queryClient.removeQueries({ queryKey: ["posts", numericPostId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/posts");
    }
  }

  async function handleDeleteComment(commentId) {
    const response = await deleteCommentMutation.mutateAsync(commentId);

    if (response.message === "comment_delete_success") {
      setDeleteTarget(null);
      await queryClient.invalidateQueries({
        queryKey: ["posts", numericPostId, "comments"],
      });
    }
  }

  async function handleCreateLike() {
    await createLikeMutation.mutateAsync();
  }

  async function handleDeleteLike() {
    await deleteLikeMutation.mutateAsync();
  }

  function handleConfirmDelete() {
    if (deleteTarget?.type === "post") {
      return handleDeletePost();
    }

    if (deleteTarget?.type === "comment") {
      return handleDeleteComment(deleteTarget.commentId);
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
  const commentCount =
    commentsQuery.data?.total_count ?? postQuery.data.comment_count;

  return (
    <main className="main post-detail-page">
      <PostDetail
        post={postQuery.data}
        commentCount={commentCount}
        onEdit={() => navigate(`/posts/${numericPostId}/edit`)}
        onDelete={() => setDeleteTarget({ type: "post" })}
        onLike={postQuery.data.is_liked ? handleDeleteLike : handleCreateLike}
        isLikePending={
          createLikeMutation.isPending || deleteLikeMutation.isPending
        }
      />
      <CommentSection
        postId={numericPostId}
        comments={comments}
        onDelete={(commentId) =>
          setDeleteTarget({ type: "comment", commentId })
        }
      />
      {deleteTarget && (
        <ConfirmDialog
          title={`${deleteTarget.type === "post" ? "게시글" : "댓글"}을 삭제하시겠습니까?`}
          description="삭제한 내용은 복구 할 수 없습니다."
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </main>
  );
}
