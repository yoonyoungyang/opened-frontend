export const DEFAULT_POST_FILTERS = Object.freeze({
  cinema: "",
  movieName: "",
  postType: "",
});

export const CINEMA_OPTIONS = [
  { value: "YONGSAN_IMAX", label: "용산 아이파크몰 IMAX" },
  { value: "WANGSIMNI_IMAX", label: "왕십리 IMAX" },
  { value: "YEOUIDO_4DX", label: "여의도 4DX" },
  { value: "COEX_DOLBY", label: "코엑스 Dolby Cinema" },
  { value: "WORLD_TOWER_SUPERPLEX", label: "월드타워 수퍼플렉스" },
];

export const POST_TYPE_OPTIONS = [
  { value: "OPEN", label: "예매 오픈" },
  { value: "CANCEL", label: "취소표" },
  { value: "SEAT", label: "좌석 후기" },
  { value: "QUESTION", label: "질문" },
];

function normalizeText(value) {
  return String(value ?? "").trim().toLocaleLowerCase("ko-KR");
}

export function filterPosts(posts, filters) {
  const movieName = normalizeText(filters.movieName);

  return posts.filter((post) => {
    const matchesCinema = !filters.cinema || post.cinema === filters.cinema;
    const matchesMovie =
      !movieName || normalizeText(post.movie_name).includes(movieName);
    const matchesPostType =
      !filters.postType || post.post_type === filters.postType;

    return matchesCinema && matchesMovie && matchesPostType;
  });
}
