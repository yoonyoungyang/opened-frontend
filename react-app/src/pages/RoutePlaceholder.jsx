export default function RoutePlaceholder({ title, description }) {
  return (
    <main className="main migration-placeholder">
      <h1 className="page-title">{title}</h1>
      <p>{description}</p>
    </main>
  );
}
