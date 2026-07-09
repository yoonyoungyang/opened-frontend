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
    } else {
    }
  })
  .finally(() => {});

const userId = localStorage.getItem("user_id");

const createPostBtn = document.querySelector(".write-button");
function movetoCreate() {
  if (Number.isNaN(userId) || userId <= 0) {
    alert("로그인하셔야 합니다."); //리팩토링 필수!!!!!
  } else {
    window.location.href = "/frontend/pages/post-create.html";
  }
}

createPostBtn.addEventListener("click", movetoCreate);
