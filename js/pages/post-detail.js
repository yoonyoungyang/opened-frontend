const params = new URLSearchParams(window.location.search);
const postId = Number(params.get("postId"));

const postError = document.querySelector(".post-error");
const post = document.querySelector(".post");
const userId = localStorage.getItem("user_id");
const commentSection = document.querySelector(".comment-section");
const commentList = document.querySelector(".comment-list");

const modal = document.querySelector(".modal-overlay");
const postDeleteButton = document.querySelector(".post-delete-button");

let editingCommentId = null;

function formattedDate(createdAt) {
  return createdAt.slice(0, 19).replace("T", " ");
}

function postDeleteAction() {
  modal.hidden = false;
  const cancelButton = document.querySelector(".cancel-button");
  const confirmButton = document.querySelector(".confirm-button");
  const confirmText = document.querySelector(".delete-modal-title");
  const subConfirmText = document.querySelector(".delete-modal-description");

  confirmText.textContent = "게시글을 삭제하시겠습니까?";
  subConfirmText.textContent = "삭제한 내용은 복구 할 수 없습니다.";

  function deleteConfirm() {
    fetch(`http://localhost:8080/posts/${postId}?userId=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "post_delete_success") {
          window.location.href = "/frontend/pages/posts.html";
        }
      });
  }

  cancelButton.addEventListener("click", () => (modal.hidden = true));
  confirmButton.addEventListener("click", deleteConfirm);
}
function replacetoEditPage() {
  return (window.location.href = `/frontend/pages/post-edit.html?postId=${postId}`);
}

postDeleteButton.addEventListener("click", postDeleteAction);
const postEditButton = document.querySelector(".post-edit-button");
postEditButton.addEventListener("click", replacetoEditPage);

const writeCommentContent = document.querySelector(".comment-input");

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
      if (Number(userId) == comment.user_id) {
        editingCommentId = comment.comment_id;

        const beforeCommentContent = comment.content;
        let AfterCommentContent = "";
        const commentSubmitBtn = document.querySelector(
          ".comment-submit-button",
        );

        commentSubmitBtn.disabled = false;

        writeCommentContent.value = comment.content;
        commentSubmitBtn.textContent = "댓글 수정";

        const commentForm = document.querySelector(".comment-form");

        writeCommentContent.addEventListener("input", function () {
          AfterCommentContent = writeCommentContent.value;
        });

        function commentEditSubmit() {
          commentSubmitBtn.disabled = true;
          fetch(
            `http://localhost:8080/posts/${postId}/comments/${commentId}?userId=${userId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: userId,
                content: writeCommentContent.value,
              }),
            },
          )
            .then((response) => response.json())
            .then((result) => {
              writeCommentContent.value = "";
              commentSubmitBtn.disabled = true;
              getComments();
              editingCommentId = null;
            });
        }

        commentForm.addEventListener("submit", function (event) {
          event.preventDefault();
          if (writeCommentContent.value) {
            commentEditSubmit();
          } else {
            commentSubmitBtn.disabled = true;
            writeCommentContent.value = "";
          }
        });
      } else {
        alert("작성자가 다릅니다."); // 리팩토링 필요, 확인 필요!!
      }
    }

    editButton.addEventListener("click", commentEditButton);

    function commentDeleteAction() {
      if (Number(userId) === comment.user_id) {
        modal.hidden = false;
        const cancelButton = document.querySelector(".cancel-button");
        const confirmButton = document.querySelector(".confirm-button");
        const confirmText = document.querySelector(".delete-modal-title");
        const subConfirmText = document.querySelector(
          ".delete-modal-description",
        );

        confirmText.textContent = "댓글을 삭제하시겠습니까?";
        subConfirmText.textContent = "삭제한 내용은 복구 할 수 없습니다.";

        function deleteConfirm() {
          fetch(
            `http://localhost:8080/posts/${postId}/comments/${commentId}?userId=${userId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
            .then((response) => response.json())
            .then((result) => {
              if (result.message === "comment_delete_success") {
                modal.hidden = true;
                getComments();
              }
            });
        }

        cancelButton.addEventListener("click", () => (modal.hidden = true));
        confirmButton.addEventListener("click", deleteConfirm);
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

function getComments() {
  fetch(`http://localhost:8080/posts/${postId}/comments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);

      if (result.message === "comment_list_success") {
        loadComments(result.data);
      }
    });
}

function getCommentSection() {
  const commentSubmitBtn = document.querySelector(".comment-submit-button");
  const commentForm = document.querySelector(".comment-form");

  writeCommentContent.addEventListener(
    "input",
    function () {
      if (writeCommentContent.value.trim() == "") {
        commentSubmitBtn.disabled = true;
      } else {
        commentSubmitBtn.disabled = false;
      }
    },
    getComments(),
  );

  commentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (writeCommentContent.value && editingCommentId === null) {
      commentSubmitBtn.disabled = true;
      fetch(`http://localhost:8080/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          content: writeCommentContent.value,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          writeCommentContent.value = "";
          commentSubmitBtn.disabled = true;
          getComments();
        });
    } else {
    }
  });
}

if (Number.isNaN(postId) || postId <= 0) {
  postError.hidden = false;
  post.hidden = true;
  commentSection.hidden = true;
} else {
  fetch(`http://localhost:8080/posts/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
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

        if (Number(userId) !== result.data.user_id) {
          postDeleteButton.disabled = true;
        }

        getCommentSection();
      } else {
        console.error(postError);
        postError.hidden = false;
        post.hidden = true;
        commentSection.hidden = true;
      }
    })
    .catch((error) => {
      postError.hidden = false;
      post.hidden = true;
      commentSection.hidden = true;
    })
    .finally(() => {});
}
