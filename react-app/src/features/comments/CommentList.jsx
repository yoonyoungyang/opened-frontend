import CommentItem from "./CommentItem";

export default function CommentList({ comments }) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.comment_id} comment={comment} />
      ))}
    </div>
  );
}
