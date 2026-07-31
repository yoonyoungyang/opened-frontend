import { useParams } from "react-router-dom";

import RoutePlaceholder from "./RoutePlaceholder";

export default function PostEditPage() {
  const { postId } = useParams();

  return (
    <RoutePlaceholder
      title="게시글 수정"
      description={`PostEditPage 연결 완료 · postId: ${postId}`}
    />
  );
}
