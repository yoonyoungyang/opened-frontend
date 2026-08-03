import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PostForm from "../features/posts/PostForm";
import { createPost } from "../features/posts/postApi";

export default function PostCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createMutation = useMutation({ mutationFn: createPost });

  async function handleCreate(post) {
    const response = await createMutation.mutateAsync(post);

    if (response.message === "post_create_success") {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${response.data.post_id}`);
    }
  }

  return (
    <main className="main post-form-page">
      <section className="create-section">
        <h2 className="create-title">게시글 작성</h2>
        <PostForm
          mode="create"
          onSubmit={handleCreate}
        />
      </section>
    </main>
  );
}
