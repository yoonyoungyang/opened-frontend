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
