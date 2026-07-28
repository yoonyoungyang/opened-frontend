import { authenticatedFetch } from "../apis/api.js";

const params = new URLSearchParams(window.location.search);
const postId = Number(params.get("postId"));

const postError = document.querySelector(".post-error");
const post = document.querySelector(".post");

const commentSection = document.querySelector(".comment-section");
const commentList = document.querySelector(".comment-list");

const modal = document.querySelector(".modal-overlay");
const postDeleteButton = document.querySelector(".post-delete-button");

const backButton = document.querySelector(".back-button");

let editingCommentId = null;

const commentForm = document.querySelector(".comment-form");
const writeCommentContent = document.querySelector(".comment-input");
const commentSubmitBtn = document.querySelector(".comment-submit-button");

backButton.addEventListener("click", function () {
  window.location.href = `./posts.html`;
});

function formattedDate(createdAt) {
  return createdAt.slice(0, 19).replace("T", " ");
}

async function fetchdeletepost() {
  const response = await authenticatedFetch(
    `http://localhost:8080/posts/${postId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response) {
    return;
  }
  const result = await response.json();
  if (result.message === "post_delete_success") {
    window.location.href = "/frontend/pages/posts.html";
  }
}

function postDeleteAction() {
  modal.hidden = false;
  const cancelButton = document.querySelector(".cancel-button");
  const confirmButton = document.querySelector(".confirm-button");
  const confirmText = document.querySelector(".delete-modal-title");
  const subConfirmText = document.querySelector(".delete-modal-description");

  confirmText.textContent = "게시글을 삭제하시겠습니까?";
  subConfirmText.textContent = "삭제한 내용은 복구 할 수 없습니다.";

  cancelButton.addEventListener("click", () => (modal.hidden = true));
  confirmButton.addEventListener("click", fetchdeletepost);
}

function replacetoEditPage() {
  return (window.location.href = `/frontend/pages/post-edit.html?postId=${postId}`);
}

postDeleteButton.addEventListener("click", postDeleteAction);
const postEditButton = document.querySelector(".post-edit-button");
postEditButton.addEventListener("click", replacetoEditPage);

commentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const content = writeCommentContent.value.trim();

  if (!content) {
    return;
  }

  if (editingCommentId === null) {
    await fetchCreateComment();
  } else {
    await fetchEditComment(editingCommentId);
  }
});

function loadComments(comments) {
  commentList.replaceChildren();

  comments.forEach((comment) => {
    const commentItem = document.createElement("article");
    commentItem.classList.add("comment");

    const commentTop = document.createElement("div");
    commentTop.classList.add("comment-top");

    const authorInformation = document.createElement("div");
    authorInformation.classList.add("comment-author-information");

    const authorImage = document.createElement("span");
    authorImage.classList.add("comment-author-image");
    if (comment.profile_img) {
      authorImage.style.backgroundImage = `url(${comment.profile_img})`;
    } else {
      authorImage.style.backgroundImage =
        "url('../assets/default-profile.png')";
    }
    const authorText = document.createElement("div");
    authorText.classList.add("comment-author-text");

    const authorRow = document.createElement("div");
    authorRow.classList.add("comment-author-row");

    const authorName = document.createElement("strong");
    authorName.classList.add("comment-author-name");
    authorName.textContent = comment.nickname;

    const commentDate = document.createElement("time");
    commentDate.classList.add("comment-date");
    const createdAt = comment.created_at;
    commentDate.textContent = formattedDate(createdAt);

    const commentContent = document.createElement("p");
    commentContent.classList.add("comment-content");
    commentContent.textContent = comment.content;

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

    commentButtons.append(editButton, deleteButton);
    const commentId = comment.comment_id;

    function commentEditButton() {
      editingCommentId = comment.comment_id;

      writeCommentContent.value = comment.content.trim();
      commentSubmitBtn.textContent = "댓글 수정";
      commentSubmitBtn.disabled = false;

      if (token) {
        //재확인
        editingCommentId = comment.comment_id;

        const beforeCommentContent = comment.content;
        let AfterCommentContent = "";

        commentSubmitBtn.disabled = false;

        writeCommentContent.value = comment.content.trim();
        commentSubmitBtn.textContent = "댓글 수정";

        writeCommentContent.addEventListener("input", function () {
          AfterCommentContent = writeCommentContent.value.trim();
        });

        function commentEditSubmit() {
          commentSubmitBtn.disabled = true;
          fetchEditComment();
        }
      } else {
        alert("작성자가 다릅니다."); // 리팩토링 필요, 확인 필요!!
      }
    }

    editButton.addEventListener("click", commentEditButton);

    function commentDeleteAction() {
      if (token) {
        //재확인
        modal.hidden = false;
        const cancelButton = document.querySelector(".cancel-button");
        const confirmButton = document.querySelector(".confirm-button");
        const confirmText = document.querySelector(".delete-modal-title");
        const subConfirmText = document.querySelector(
          ".delete-modal-description",
        );

        confirmText.textContent = "댓글을 삭제하시겠습니까?";
        subConfirmText.textContent = "삭제한 내용은 복구 할 수 없습니다.";

        cancelButton.addEventListener("click", () => (modal.hidden = true));
        confirmButton.addEventListener("click", () =>
          fetchDeleteComment(commentId),
        );
      } else {
        alert("작성자가 다릅니다."); //이것도 리팩토링 필수
      }
    }

    deleteButton.addEventListener("click", commentDeleteAction);

    authorRow.append(authorName, commentDate);
    authorText.append(authorRow, commentContent);
    authorInformation.append(authorImage, authorText);

    commentTop.append(authorInformation, commentButtons);
    commentItem.append(commentTop);
    commentList.append(commentItem);
  });
}

function getCommentSection() {
  writeCommentContent.addEventListener("input", function () {
    if (writeCommentContent.value.trim() == "") {
      commentSubmitBtn.disabled = true;
    } else {
      commentSubmitBtn.disabled = false;
    }
  });

  commentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (writeCommentContent.value.trim() && editingCommentId === null) {
      commentSubmitBtn.disabled = true;
      fetchCreateComment();
    }
  });
}
if (Number.isNaN(postId) || postId <= 0) {
  postError.hidden = false;
  post.hidden = true;
  commentSection.hidden = true;
} else {
  fetchPostDetail();
}

async function fetchPostDetail() {
  try {
    const response = await authenticatedFetch(
      `http://localhost:8080/posts/${postId}`,
      {
        method: "GET",
      },
    );
    if (!response) {
      return;
    }
    const result = await response.json();
    if (result.message === "post_detail_success") {
      postError.hidden = true;
      post.hidden = false;
      commentSection.hidden = false;
      console.log("성공 분기 실행");
      console.log(postError.hidden);
      const postTitle = document.querySelector(".post-title");
      const postContent = document.querySelector(".post-text");
      const likeCount = document.querySelector("#like-count");
      const viewCount = document.querySelector("#view-count");
      const commentCount = document.querySelector("#comment-count");
      const postDate = document.querySelector(".post-date");
      const authorNickname = document.querySelector(".author-name");
      const authorImg = document.querySelector(".author-image");

      const createdAt = result.data.created_at;
      const replaceDate = formattedDate(createdAt);

      postTitle.textContent = result.data.title;
      postContent.textContent = result.data.content;
      likeCount.textContent = result.data.like_count;
      viewCount.textContent = result.data.view_count;
      commentCount.textContent = result.data.comment_count;
      postDate.textContent = replaceDate;
      authorNickname.textContent = result.data.nickname;
      if (result.data.profile_img) {
        authorImg.style.backgroundImage = `url(${result.data.profile_img})`;
      } else {
        authorImg.style.backgroundImage =
          "url('../assets/default-profile.png')";
      }

      if (!result.data.is_mine) {
        //재확인!!!!!!!!
        postDeleteButton.disabled = true;
      }

      getCommentSection();
      fetchCommentsList();
    } else {
      console.error(postError);
      postError.hidden = false;
      post.hidden = true;
      commentSection.hidden = true;
    }
  } catch (error) {
    postError.hidden = false;
    post.hidden = true;
    commentSection.hidden = true;
  }
}

async function fetchCreateComment() {
  const response = await authenticatedFetch(
    `http://localhost:8080/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: writeCommentContent.value.trim(),
      }),
    },
  );
  if (!response) {
    return;
  }
  const result = await response.json();
  if (result.message === "comment_create_success") {
    writeCommentContent.value = "";
    commentSubmitBtn.disabled = true;
    fetchCommentsList();
  }
}
async function fetchEditComment(commentId) {
  const response = await authenticatedFetch(
    `http://localhost:8080/posts/${postId}/comments/${commentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: writeCommentContent.value,
      }),
    },
  );
  if (!response) {
    return;
  }
  const result = await response.json();
  if (result.message === "comment_edit_success") {
    writeCommentContent.value = "";
    commentSubmitBtn.disabled = true;
    commentSubmitBtn.textContent = "댓글 등록";

    fetchCommentsList();
    editingCommentId = null;
  }
}
async function fetchDeleteComment(commentId) {
  const response = await authenticatedFetch(
    `http://localhost:8080/posts/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response) {
    return;
  }
  const result = await response.json();
  if (result.message === "comment_delete_success") {
    modal.hidden = true;
    fetchCommentsList();
  }
}

async function fetchCommentsList() {
  const response = await authenticatedFetch(
    `http://localhost:8080/posts/${postId}/comments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response) {
    return;
  }
  const result = await response.json();
  if (result.message === "comment_list_success") {
    loadComments(result.data);
  }
}
