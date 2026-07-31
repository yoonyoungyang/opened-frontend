import { useParams } from "react-router-dom";

import RoutePlaceholder from "./RoutePlaceholder";

export default function PostDetailPage() {
  const { postId } = useParams();

  return (
    <RoutePlaceholder
      title="게시글 상세"
      description={`PostDetailPage 연결 완료 · postId: ${postId}`}
    />
  );
}
