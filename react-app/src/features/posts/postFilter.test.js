import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_POST_FILTERS, filterPosts } from "./postFilter.js";

const posts = [
  {
    post_id: 1,
    cinema: "YONGSAN_IMAX",
    movie_name: "어벤져스: 엔드게임",
    post_type: "OPEN",
  },
  {
    post_id: 2,
    cinema: "COEX_DOLBY",
    movie_name: "Dune: Part 2",
    post_type: "SEAT",
  },
  { post_id: 3, title: "분류 정보가 없는 기존 게시글" },
];

test("필터가 없으면 분류 정보가 없는 기존 게시글도 모두 유지한다", () => {
  assert.deepEqual(filterPosts(posts, DEFAULT_POST_FILTERS), posts);
});

test("상영관과 게시글 유형은 코드가 정확히 일치하는 게시글만 반환한다", () => {
  assert.deepEqual(
    filterPosts(posts, {
      cinema: "YONGSAN_IMAX",
      movieName: "",
      postType: "OPEN",
    }).map((post) => post.post_id),
    [1],
  );
});

test("영화명은 앞뒤 공백과 대소문자를 무시해 부분 일치시킨다", () => {
  assert.deepEqual(
    filterPosts(posts, {
      cinema: "",
      movieName: "  PART 2 ",
      postType: "",
    }).map((post) => post.post_id),
    [2],
  );
});

test("필터 조건이 여러 개면 모두 일치해야 한다", () => {
  assert.deepEqual(
    filterPosts(posts, {
      cinema: "YONGSAN_IMAX",
      movieName: "Dune",
      postType: "OPEN",
    }),
    [],
  );
});
