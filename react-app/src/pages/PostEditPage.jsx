import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import PostForm from "../features/posts/PostForm";
import { updatePost } from "../features/posts/postApi";
import { postQueries } from "../features/posts/postQueries";
import ErrorState from "../shared/components/ErrorState";

export default function PostEditPage() {
  const { postId } = useParams();
  const numericPostId = Number(postId);
  const isValidPostId = !Number.isNaN(numericPostId) && numericPostId > 0;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    ...postQueries.detail(numericPostId),
    enabled: isValidPostId,
  });
  const updateMutation = useMutation({
    mutationFn: (post) => updatePost(numericPostId, post),
  });

  async function handleEdit(post) {
    const response = await updateMutation.mutateAsync(post);

    if (response.message === "post_edit_success") {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", numericPostId] });
      navigate(`/posts/${numericPostId}`);
    }
  }

  if (!isValidPostId || postQuery.isError || (postQuery.data && !postQuery.data.is_mine)) {
    return (
      <main className="main post-form-page">
        <ErrorState message="사용자 권한이 없습니다." buttonLabel="돌아가기" />
      </main>
    );
  }

  if (!postQuery.data) {
    return <main className="main post-form-page"></main>;
  }

  return (
    <main className="main post-form-page">
      <section className="edit-section">
        <h2 className="edit-title">게시글 수정</h2>
        <PostForm
          mode="edit"
          initialTitle={postQuery.data.title}
          initialContent={postQuery.data.content}
          onSubmit={handleEdit}
        />
      </section>
    </main>
  );
}
