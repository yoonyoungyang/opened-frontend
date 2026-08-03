export default function ErrorState() {
  return (
    <section className="post-error" aria-live="polite">
      <p className="post-error-message">게시글을 불러오지 못했어요.</p>
      <button type="button" className="retry-button">
        다시 시도
      </button>
    </section>
  );
}
