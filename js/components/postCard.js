export const createPostCard = ({
  title,
  likes,
  comments,
  views,
  createdAt,
  author,
}) => {
  const article = document.createElement("article");

  article.className = "post-card";
  article.innerHTML = `
    <div class="post-content">
      <h2 class="post-title"></h2>
      <div class="post-information">
        <div class="post-counts">
          <span class="post-like-count"></span>
          <span class="post-comment-count"></span>
          <span class="post-view-count"></span>
        </div>
        <time></time>
      </div>
    </div>
    <div class="post-author">
      <span class="author-image"></span>
      <span class="author-name"></span>
    </div>
  `;

  article.querySelector(".post-title").textContent = title;
  article.querySelector(".post-like-count").textContent = `좋아요 ${likes}`;
  article.querySelector(".post-comment-count").textContent = `댓글 ${comments}`;
  article.querySelector(".post-view-count").textContent = `조회수 ${views}`;
  article.querySelector("time").textContent = createdAt;
  article.querySelector(".author-name").textContent = author;

  return article;
};
