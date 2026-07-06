export const createCommentItem = ({ author, createdAt, content, editable }) => {
  const article = document.createElement("article");

  article.className = "comment";
  article.innerHTML = `
    <div class="comment-top">
      <div class="comment-author-information">
        <span class="comment-author-image"></span>
        <div class="comment-author-text">
          <div class="comment-author-row">
            <strong class="comment-author-name"></strong>
            <time class="comment-date"></time>
          </div>
          <p class="comment-content"></p>
        </div>
      </div>
    </div>
  `;

  article.querySelector(".comment-author-name").textContent = author;
  article.querySelector(".comment-date").textContent = createdAt;
  article.querySelector(".comment-content").textContent = content;

  if (editable) {
    const buttons = document.createElement("div");

    buttons.className = "comment-buttons";
    buttons.innerHTML = `
      <button type="button" class="small-button">수정</button>
      <button type="button" class="small-button">삭제</button>
    `;

    article.querySelector(".comment-top").append(buttons);
  }

  return article;
};
