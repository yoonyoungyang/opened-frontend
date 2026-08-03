import assert from "node:assert/strict";
import test from "node:test";

import {
  limitPostTitle,
  POST_REQUIRED_MESSAGE,
  validatePost,
} from "./postValidation.js";

test("게시글 제목을 26자로 제한한다", () => {
  assert.equal(limitPostTitle("가".repeat(30)), "가".repeat(26));
});

test("제목과 내용이 모두 입력되어야 게시글 폼이 유효하다", () => {
  assert.deepEqual(validatePost("", "내용"), {
    isValid: false,
    message: POST_REQUIRED_MESSAGE,
  });
  assert.equal(validatePost("제목", "내용").isValid, true);
});
