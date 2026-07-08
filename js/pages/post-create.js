const userId = localStorage.getItem("user_id");
const titleEl = document.querySelector("#post-title");
const contentEl = document.querySelector("#post-content");
const submitButtonEl = document.querySelector(".submit-button");
const helpTxt = document.querySelector(".helper-text");
const formEl = document.querySelector(".create-form");

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
  updateFormState();
});
contentEl.addEventListener("input", updateFormState);

function updateFormState() {
  const isCreateValid = updateHelperText();
  submitButtonEl.disabled = !isCreateValid;
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  if (submitButtonEl.disabled == false) {
    fetch("http://localhost:8080/posts", {
      method: "POST",
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
        if (result.message === "post_create_success") {
          console.log(result);
          const postId = result.data.post_id;
          window.location.href = `./post-detail.html?postId=${postId}`;
        } else {
        }
      })
      .finally(() => {});
  }
});
