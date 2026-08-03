export default function ConfirmDialog({
  title,
  description,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="modal-overlay">
      <section
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <h2 id="delete-modal-title" className="delete-modal-title">
          {title}
        </h2>
        <p id="delete-modal-description" className="delete-modal-description">
          {description}
        </p>
        <div className="delete-modal-buttons">
          <button type="button" className="modal-button cancel-button" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="modal-button confirm-button" onClick={onConfirm}>
            확인
          </button>
        </div>
      </section>
    </div>
  );
}
