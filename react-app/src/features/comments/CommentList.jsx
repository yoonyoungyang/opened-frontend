import CommentItem from "./CommentItem";

export default function CommentList({ comments, onEdit, onDelete }) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.comment_id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
