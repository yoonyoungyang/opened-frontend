import assert from "node:assert/strict";
import test from "node:test";

import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from "./authValidation.js";

test("이메일의 빈 값과 형식을 검증한다", () => {
  assert.deepEqual(validateEmail(""), {
    isValid: false,
    message: "이메일을 입력해주세요.",
  });
  assert.equal(validateEmail("opened").isValid, false);
  assert.equal(validateEmail("opened@example.com").isValid, true);
});

test("비밀번호의 길이와 문자 조합을 검증한다", () => {
  assert.equal(validatePassword("password").isValid, false);
  assert.equal(validatePassword("Opened1!").isValid, true);
});

test("비밀번호 확인 값의 일치 여부를 검증한다", () => {
  assert.equal(validatePasswordConfirm("Opened1!", "Opened2!").isValid, false);
  assert.equal(validatePasswordConfirm("Opened1!", "Opened1!").isValid, true);
});

test("닉네임의 길이와 공백을 검증한다", () => {
  assert.equal(validateNickname("열렸 나요").isValid, false);
  assert.equal(validateNickname("열렸나요열렸나요열렸나요열렸").isValid, false);
  assert.equal(validateNickname("열렸나요").isValid, true);
});
