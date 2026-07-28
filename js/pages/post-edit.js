import { authenticatedFetch } from "../apis/api.js";

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
} else {
  fetchPostDetail();
}

async function fetchPostDetail() {
  const result = await authenticatedFetch(
    `http://localhost:8080/posts/${postId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!result) {
    return;
  }
  const response = await result.json();
  if (response.message === "post_detail_success") {
    if (response.data.is_mine) {
      post.hidden = false;
      postError.hidden = true;

      BeforeTitle = response.data.title;
      BeforeContent = response.data.content;
      AfterTitle = response.data.title;
      AfterContent = response.data.content;

      titleEl.value = response.data.title;
      contentEl.value = response.data.content;

      updateHelperText();
      updateFormState();
    } else {
      post.hidden = true;
      postError.hidden = false;
    }
  }
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
    fetchPostEdit();
  }
});

async function fetchPostEdit() {
  const result = await authenticatedFetch(
    `http://localhost:8080/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titleEl.value,
        content: contentEl.value,
      }),
    },
  );
  if (!result) {
    return;
  }
  const response = await result.json();
  if (response.message === "post_edit_success") {
    console.log(response);
    window.location.href = `./post-detail.html?postId=${postId}`;
  } else {
  }
}
