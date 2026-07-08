const params = new URLSearchParams(window.location.search);
const postId = Number(params.get("postId"));
const userId = Number(localStorage.getItem("user_id"));

const postError = document.querySelector(".post-error");
const post = document.querySelector(".post");

const commentSection = document.querySelector(".comment-section");
const commentList = document.querySelector(".comment-list");
const commentForm = document.querySelector(".comment-form");
const commentInput = document.querySelector(".comment-input");
const commentSubmitButton = document.querySelector(".comment-submit-button");

const commentCount = document.querySelector("#comment-count");

const modalOverlay = document.querySelector(".modal-overlay");
const modalTitle = document.querySelector(".delete-modal-title");
const modalDescription = document.querySelector(".delete-modal-description");
const modalCancelButton = document.querySelector(".cancel-button");
const modalConfirmButton = document.querySelector(".confirm-button");

let editingCommentId = null;
let deletingCommentId = null;

function formatDate(createdAt) {
  return createdAt.slice(0, 19).replace("T", " ");
}

function closeDeleteModal() {
  modalOverlay.classList.add("hidden");
  deletingCommentId = null;
}

function openCommentDeleteModal(commentId) {
  deletingCommentId = commentId;

  modalTitle.textContent = "댓글을 삭제하시겠습니까?";
  modalDescription.textContent = "삭제한 내용은 복구 할 수 없습니다.";

  modalOverlay.classList.remove("hidden");
}

function resetCommentForm() {
  editingCommentId = null;

  commentInput.value = "";
  commentSubmitButton.textContent = "댓글 등록";
  commentSubmitButton.disabled = true;
}

function startCommentEdit(comment) {
  editingCommentId = comment.comment_id;

  commentInput.value = comment.content;
  commentSubmitButton.textContent = "댓글 수정";
  commentSubmitButton.disabled = false;

  commentInput.focus();
}

function loadComments(comments) {
  commentList.replaceChildren();
  commentCount.textContent = comments.length;

  comments.forEach((comment) => {
    const commentItem = document.createElement("article");
    commentItem.classList.add("comment");

    const commentTop = document.createElement("div");
    commentTop.classList.add("comment-top");

    const authorInformation = document.createElement("div");
    authorInformation.classList.add("comment-author-information");

    const authorImage = document.createElement("span");
    authorImage.classList.add("comment-author-image");

    const profileImage = comment.profile_img || "../assets/default-img.png";

    authorImage.style.backgroundImage = `url("${profileImage}")`;

    const authorText = document.createElement("div");
    authorText.classList.add("comment-author-text");

    const authorRow = document.createElement("div");
    authorRow.classList.add("comment-author-row");

    const authorName = document.createElement("strong");
    authorName.classList.add("comment-author-name");
    authorName.textContent = comment.nickname;

    const commentDate = document.createElement("time");
    commentDate.classList.add("comment-date");
    commentDate.textContent = formatDate(comment.created_at);
    commentDate.dateTime = comment.created_at;

    const commentContent = document.createElement("p");
    commentContent.classList.add("comment-content");
    commentContent.textContent = comment.content;

    authorRow.append(authorName, commentDate);
    authorText.append(authorRow, commentContent);
    authorInformation.append(authorImage, authorText);

    commentTop.append(authorInformation);

    if (userId === comment.user_id) {
      const commentButtons = document.createElement("div");
      commentButtons.classList.add("comment-buttons");

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.classList.add("small-button");
      editButton.textContent = "수정";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.classList.add("small-button");
      deleteButton.textContent = "삭제";

      editButton.addEventListener("click", function () {
        startCommentEdit(comment);
      });

      deleteButton.addEventListener("click", function () {
        openCommentDeleteModal(comment.comment_id);
      });

      commentButtons.append(editButton, deleteButton);
      commentTop.append(commentButtons);
    }

    commentItem.append(commentTop);
    commentList.append(commentItem);
  });
}

function fetchComments() {
  fetch(`http://localhost:8080/posts/${postId}/comments`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message === "comment_list_success") {
        loadComments(result.data);
      } else {
        console.error(result.errors);
      }
    })
    .catch((error) => {
      console.error("댓글 목록 조회 실패:", error);
    });
}

function createComment(content) {
  commentSubmitButton.disabled = true;

  fetch(`http://localhost:8080/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      content: content,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message === "comment_create_success") {
        resetCommentForm();
        fetchComments();
      } else {
        console.error(result.errors);
        commentSubmitButton.disabled = false;
      }
    })
    .catch((error) => {
      console.error("댓글 작성 실패:", error);
      commentSubmitButton.disabled = false;
    });
}

function updateComment(content) {
  commentSubmitButton.disabled = true;

  fetch(`http://localhost:8080/posts/${postId}/comments/${editingCommentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      content: content,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message === "comment_edit_success") {
        resetCommentForm();
        fetchComments();
      } else {
        console.error(result.errors);
        commentSubmitButton.disabled = false;
      }
    })
    .catch((error) => {
      console.error("댓글 수정 실패:", error);
      commentSubmitButton.disabled = false;
    });
}

function deleteComment() {
  if (deletingCommentId === null) {
    return;
  }

  modalConfirmButton.disabled = true;

  fetch(
    `http://localhost:8080/posts/${postId}/comments/${deletingCommentId}?userId=${userId}`,
    {
      method: "DELETE",
    },
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.message === "comment_delete_success") {
        closeDeleteModal();
        resetCommentForm();
        fetchComments();
      } else {
        console.error(result.errors);
      }
    })
    .catch((error) => {
      console.error("댓글 삭제 실패:", error);
    })
    .finally(() => {
      modalConfirmButton.disabled = false;
    });
}

function fetchPostDetail() {
  fetch(`http://localhost:8080/posts/${postId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message !== "post_detail_success") {
        postError.hidden = false;
        post.hidden = true;
        commentSection.hidden = true;
        return;
      }

      postError.hidden = true;
      post.hidden = false;
      commentSection.hidden = false;

      const postTitle = document.querySelector(".post-title");
      const postContent = document.querySelector(".post-text");
      const likeCount = document.querySelector("#like-count");
      const viewCount = document.querySelector("#view-count");
      const postDate = document.querySelector(".post-date");
      const authorNickname = document.querySelector(".author-name");
      const authorImage = document.querySelector(".author-image");
      const postButtons = document.querySelector(".post-buttons");

      postTitle.textContent = result.data.title;
      postContent.textContent = result.data.content;
      likeCount.textContent = result.data.like_count;
      viewCount.textContent = result.data.view_count;
      commentCount.textContent = result.data.comment_count;

      postDate.textContent = formatDate(result.data.created_at);
      postDate.dateTime = result.data.created_at;

      authorNickname.textContent = result.data.nickname;

      const profileImage =
        result.data.profile_img || "../assets/default-img.png";

      authorImage.style.backgroundImage = `url("${profileImage}")`;

      postButtons.hidden = userId !== result.data.user_id;

      fetchComments();
    })
    .catch((error) => {
      console.error("게시글 상세 조회 실패:", error);

      postError.hidden = false;
      post.hidden = true;
      commentSection.hidden = true;
    });
}

commentInput.addEventListener("input", function () {
  commentSubmitButton.disabled = commentInput.value.trim() === "";
});

commentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const content = commentInput.value.trim();

  if (content === "") {
    commentSubmitButton.disabled = true;
    return;
  }

  if (editingCommentId === null) {
    createComment(content);
  } else {
    updateComment(content);
  }
});

modalCancelButton.addEventListener("click", function () {
  closeDeleteModal();
});

modalConfirmButton.addEventListener("click", function () {
  deleteComment();
});

modalOverlay.addEventListener("click", function (event) {
  if (event.target === modalOverlay) {
    closeDeleteModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
    closeDeleteModal();
  }
});

if (Number.isNaN(postId) || postId <= 0) {
  postError.hidden = false;
  post.hidden = true;
  commentSection.hidden = true;
} else {
  fetchPostDetail();
}
