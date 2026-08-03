import assert from "node:assert/strict";
import test from "node:test";

import { formatDate } from "./formatDate.js";

test("기존 게시글 날짜 표시 형식을 유지한다", () => {
  assert.equal(
    formatDate("2026-08-03T12:34:56.123456"),
    "2026-08-03 12:34:56",
  );
});
