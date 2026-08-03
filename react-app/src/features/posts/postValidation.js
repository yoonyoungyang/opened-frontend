export const POST_TITLE_MAX_LENGTH = 26;
export const POST_REQUIRED_MESSAGE = "*제목, 내용을 모두 작성해주세요.";

export function limitPostTitle(title) {
  return title.slice(0, POST_TITLE_MAX_LENGTH);
}

export function validatePost(title, content) {
  return {
    isValid: title !== "" && content !== "",
    message: title === "" || content === "" ? POST_REQUIRED_MESSAGE : "",
  };
}
