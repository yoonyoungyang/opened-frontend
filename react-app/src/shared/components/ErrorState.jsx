export default function ErrorState({
  message = "게시글을 불러오지 못했어요.",
  buttonLabel = "다시 시도",
}) {
  return (
    <section className="post-error" aria-live="polite">
      <p className="post-error-message">{message}</p>
      <button type="button" className="retry-button">
        {buttonLabel}
      </button>
    </section>
  );
}
