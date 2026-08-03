export function formatDate(createdAt) {
  return createdAt.slice(0, 19).replace("T", " ");
}
