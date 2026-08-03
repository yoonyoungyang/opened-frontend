export default function FormField({
  id,
  label,
  helperText,
  required = false,
  containerClassName = "",
  ...inputProps
}) {
  const helperId = `${id}-helper`;

  return (
    <div className={`form-group ${containerClassName}`.trim()}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span aria-hidden="true">*</span>}
      </label>

      <input
        {...inputProps}
        id={id}
        className="form-input"
        aria-describedby={helperId}
        aria-invalid={Boolean(helperText)}
      />

      <p id={helperId} className={`helper-text ${id}-helper-text`}>
        {helperText}
      </p>
    </div>
  );
}
