import { apiRequest } from "../../shared/api/client";

export async function getPosts() {
  const response = await apiRequest("/posts");

  if (response.message !== "post_list_success") {
    throw new Error("게시글 목록을 불러오지 못했습니다.");
  }

  return response.data;
}

export async function getPost(postId) {
  const response = await apiRequest(`/posts/${postId}`, { auth: true });

  if (response.message !== "post_detail_success") {
    throw new Error("게시글을 불러오지 못했습니다.");
  }

  return response.data;
}
