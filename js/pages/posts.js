const userId = localStorage.getItem("user_id");
const postListEl = document.querySelector(".post-list");

function formattedDate(createdAt) {
  return createdAt.slice(0, 19).replace("T", " ");
}

function loadPosts(posts) {
  postListEl.replaceChildren();

  posts.forEach((post) => {
    const postCard = document.createElement("article");
    postCard.classList.add("post-card");

    const postContent = document.createElement("div");
    postContent.classList.add("post-content");

    const postTitle = document.createElement("h2");
    postTitle.classList.add("post-title");
    postTitle.textContent = post.title;

    const postInformation = document.createElement("div");
    postInformation.classList.add("post-information");

    const postCounts = document.createElement("div");
    postCounts.classList.add("post-counts");

    const likeCount = document.createElement("span");
    likeCount.textContent = `좋아요 ${post.like_count}`;

    const commentCount = document.createElement("span");
    commentCount.textContent = `댓글 ${post.comment_count}`;

    const viewCount = document.createElement("span");
    viewCount.textContent = `조회수 ${post.view_count}`;

    const postDate = document.createElement("time");
    postDate.textContent = formattedDate(post.created_at);
    postDate.dateTime = post.created_at;

    const postAuthor = document.createElement("div");
    postAuthor.classList.add("post-author");

    const authorImage = document.createElement("span");
    authorImage.classList.add("author-image");

    if (post.profile_img) {
      authorImage.style.backgroundImage = `url(${post.profile_img})`;
    } else {
      authorImage.style.backgroundImage =
        "url('../assets/default-profile.png')";
    }

    const authorName = document.createElement("span");
    authorName.classList.add("author-name");
    authorName.textContent = post.nickname;

    postCounts.append(likeCount, commentCount, viewCount);
    postInformation.append(postCounts, postDate);
    postContent.append(postTitle, postInformation);
    postAuthor.append(authorImage, authorName);

    postCard.append(postContent, postAuthor);

    postCard.addEventListener("click", function () {
      window.location.href = `./post-detail.html?postId=${post.post_id}`;
    });

    postListEl.append(postCard);
  });
}

fetch("http://localhost:8080/posts", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((result) => {
    if (result.message === "post_list_success") {
      console.log(result);
      loadPosts(result.data);
    } else {
    }
  })
  .finally(() => {});

const createPostBtn = document.querySelector(".write-button");
function movetoCreate() {
  if (Number.isNaN(userId) || userId <= 0) {
    alert("로그인하셔야 합니다."); //리팩토링 필수!!!!!
  } else {
    window.location.href = "/frontend/pages/post-create.html";
  }
}

createPostBtn.addEventListener("click", movetoCreate);
