import assert from "node:assert/strict";
import test from "node:test";

import {
  validateCurrentPassword,
  validateNewPassword,
  validateNewPasswordConfirm,
} from "./passwordValidation.js";

test("현재 비밀번호는 빈 값만 검증한다", () => {
  assert.equal(validateCurrentPassword("").isValid, false);
  assert.equal(validateCurrentPassword("현재비밀번호").isValid, true);
});

test("새 비밀번호 형식과 확인 값 일치를 검증한다", () => {
  assert.equal(validateNewPassword("password", "").isValid, false);
  assert.equal(validateNewPassword("Opened1!", "Opened2!").isValid, false);
  assert.equal(validateNewPassword("Opened1!", "Opened1!").isValid, true);
});

test("새 비밀번호 확인의 빈 값과 불일치 문구를 유지한다", () => {
  assert.equal(
    validateNewPasswordConfirm("Opened1!", "").message,
    "비밀번호를 한 번 더 입력해주세요.",
  );
  assert.equal(
    validateNewPasswordConfirm("Opened1!", "Opened2!").message,
    "*비밀번호와 다릅니다.",
  );
});
