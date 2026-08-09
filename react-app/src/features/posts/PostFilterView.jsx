import { CINEMA_OPTIONS, POST_TYPE_OPTIONS } from "./postFilter";

export default function PostFilterView({ filters, onChange, onReset, onSubmit }) {
  function handleChange(event) {
    onChange({
      ...filters,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <section className="cinema-ui-filter" aria-label="게시글 필터">
      <div className="cinema-ui-filter-heading">
        <h2>게시글 찾기</h2>
        <button type="button" className="cinema-ui-filter-reset" onClick={onReset}>
          초기화
        </button>
      </div>

      <form className="cinema-ui-filter-controls" onSubmit={handleSubmit}>
        <label className="cinema-ui-filter-field">
          <span>상영관</span>
          <select
            name="cinema"
            className="cinema-ui-filter-select"
            value={filters.cinema}
            onChange={handleChange}
          >
            <option value="">전체 상영관</option>
            {CINEMA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="cinema-ui-filter-field">
          <span>영화명</span>
          <input
            type="search"
            name="movieName"
            className="cinema-ui-filter-input"
            placeholder="영화명을 입력하세요"
            value={filters.movieName}
            onChange={handleChange}
          />
        </label>

        <label className="cinema-ui-filter-field">
          <span>게시글 유형</span>
          <select
            name="postType"
            className="cinema-ui-filter-select"
            value={filters.postType}
            onChange={handleChange}
          >
            <option value="">전체 유형</option>
            {POST_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="cinema-ui-filter-submit">
          확인
        </button>
      </form>
    </section>
  );
}
