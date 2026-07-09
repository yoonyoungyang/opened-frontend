const userId = localStorage.getItem("user_id");
const titleEl = document.querySelector("#post-title");
const contentEl = document.querySelector("#post-content");
const submitButtonEl = document.querySelector(".submit-button");
const helpTxt = document.querySelector(".helper-text");
const formEl = document.querySelector(".edit-form");
const postError = document.querySelector(".post-error");
const post = document.querySelector(".edit-section");
const params = new URLSearchParams(window.location.search);
const postId = Number(params.get("postId"));

const backButton = document.querySelector(".back-button");
backButton.addEventListener("click", function () {
  window.location.href = `./post-detail.html?postId=${postId}`;
});

let BeforeTitle = null;
let BeforeContent = null;
let AfterTitle = null;
let AfterContent = null;

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
      if (Number(userId) === result.data.user_id) {
        post.hidden = false;
        postError.hidden = true;

        BeforeTitle = result.data.title;
        BeforeContent = result.data.content;
        AfterTitle = result.data.title;
        AfterContent = result.data.content;

        titleEl.value = result.data.title;
        contentEl.value = result.data.content;

        updateHelperText();
        updateFormState();
      } else {
        post.hidden = true;
        postError.hidden = false;
      }
    });
}

function updateHelperText() {
  if (titleEl.value == "" || contentEl.value == "") {
    helpTxt.textContent = "*제목, 내용을 모두 작성해주세요.";
    return false;
  } else {
    helpTxt.textContent = "";
    return true;
  }
}

titleEl.addEventListener("input", function () {
  titleEl.value = titleEl.value.slice(0, 26);
  AfterTitle = titleEl.value;
  updateHelperText();
  updateFormState();
});

contentEl.addEventListener("input", function () {
  AfterContent = contentEl.value;
  updateHelperText();

  updateFormState();
});

function updateFormState() {
  if (
    updateHelperText() &&
    (BeforeTitle !== AfterTitle || AfterContent !== BeforeContent)
  ) {
    submitButtonEl.disabled = false;
  } else {
    submitButtonEl.disabled = true;
  }
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  if (submitButtonEl.disabled == false) {
    fetch(`http://localhost:8080/posts/${postId}?UserId=${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        title: titleEl.value,
        content: contentEl.value,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "post_edit_success") {
          console.log(result);
          window.location.href = `./post-detail.html?postId=${postId}`;
        } else {
        }
      })
      .finally(() => {});
  }
});
