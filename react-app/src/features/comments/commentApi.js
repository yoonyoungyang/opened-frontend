import { apiRequest } from "../../shared/api/client";

export async function getComments(postId) {
  const response = await apiRequest(`/posts/${postId}/comments`, { auth: true });

  if (response.message !== "comment_list_success") {
    throw new Error("댓글을 불러오지 못했습니다.");
  }

  return response.data;
}

export function createComment(postId, content) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: "POST",
    auth: true,
    body: { content },
  });
}

export function updateComment(postId, commentId, content) {
  return apiRequest(`/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    auth: true,
    body: { content },
  });
}

export function deleteComment(postId, commentId) {
  return apiRequest(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    auth: true,
  });
}
