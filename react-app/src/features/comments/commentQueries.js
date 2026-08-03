import { getComments } from "./commentApi";

export const commentQueries = {
  list: (postId) => ({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => getComments(postId),
  }),
};
