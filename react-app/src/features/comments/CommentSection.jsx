import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createComment, updateComment } from "./commentApi";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default function CommentSection({ postId, comments, onDelete }) {
  const [editingComment, setEditingComment] = useState(null);
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (content) => createComment(postId, content),
  });
  const updateMutation = useMutation({
    mutationFn: ({ commentId, content }) =>
      updateComment(postId, commentId, content),
  });

  function refreshComments() {
    queryClient.invalidateQueries({
      queryKey: ["posts", postId, "comments"],
    });
  }

  async function handleSubmit(content) {
    if (editingComment === null) {
      const response = await createMutation.mutateAsync(content);

      if (response.message === "comment_create_success") {
        refreshComments();
        return true;
      }

      return false;
    }

    const response = await updateMutation.mutateAsync({
      commentId: editingComment.comment_id,
      content,
    });

    if (response.message === "comment_edit_success") {
      setEditingComment(null);
      refreshComments();
      return true;
    }

    return false;
  }

  return (
    <section className="comment-section">
      <CommentForm
        key={editingComment?.comment_id ?? "create"}
        editingComment={editingComment}
        onSubmit={handleSubmit}
      />
      <CommentList
        comments={comments}
        onEdit={setEditingComment}
        onDelete={onDelete}
      />
    </section>
  );
}
