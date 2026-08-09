export const POST_TITLE_MAX_LENGTH = 26;
export const POST_REQUIRED_MESSAGE =
  "*게시글 유형, 상영관, 영화명, 제목, 내용을 모두 작성해주세요.";

export function limitPostTitle(title) {
  return title.slice(0, POST_TITLE_MAX_LENGTH);
}

export function validatePost(title, content, { cinema, movieName, postType }) {
  const isValid = Boolean(
    title.trim() &&
      content.trim() &&
      cinema &&
      movieName.trim() &&
      postType,
  );

  return {
    isValid,
    message: isValid ? "" : POST_REQUIRED_MESSAGE,
  };
}
