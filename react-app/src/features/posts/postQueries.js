import { getPost, getPosts } from "./postApi";

export const postQueries = {
  list: () => ({
    queryKey: ["posts"],
    queryFn: getPosts,
  }),
  detail: (postId) => ({
    queryKey: ["posts", postId],
    queryFn: () => getPost(postId),
  }),
};
