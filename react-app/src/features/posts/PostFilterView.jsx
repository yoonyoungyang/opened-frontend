export default function PostFilterView() {
  return (
    <section className="cinema-ui-filter" aria-label="게시글 필터">
      <div className="cinema-ui-filter-heading">
        <h2>게시글 찾기</h2>
        <button type="button" className="cinema-ui-filter-reset">
          초기화
        </button>
      </div>

      <div className="cinema-ui-filter-controls">
        <label className="cinema-ui-filter-field">
          <span>상영관</span>
          <select className="cinema-ui-filter-select" defaultValue="전체 상영관">
            <option>전체 상영관</option>
            <option>용산 아이파크몰 IMAX</option>
            <option>왕십리 IMAX</option>
            <option>여의도 4DX</option>
            <option>코엑스 Dolby Cinema</option>
            <option>월드타워 수퍼플렉스</option>
          </select>
        </label>

        <label className="cinema-ui-filter-field">
          <span>영화명</span>
          <input
            type="search"
            className="cinema-ui-filter-input"
            placeholder="영화명을 입력하세요"
          />
        </label>

        <label className="cinema-ui-filter-field">
          <span>게시글 유형</span>
          <select className="cinema-ui-filter-select" defaultValue="전체 유형">
            <option>전체 유형</option>
            <option>예매 오픈</option>
            <option>취소표</option>
            <option>좌석 후기</option>
            <option>질문</option>
          </select>
        </label>

        <button type="button" className="cinema-ui-filter-submit">
          확인
        </button>
      </div>
    </section>
  );
}
