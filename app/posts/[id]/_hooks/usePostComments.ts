import { apiFetch } from "@/app/lib/backend/client";
import { PostCommentDTO } from "@/app/type/post";
import { useEffect, useState } from "react";

export default function usePostComments(postId: number) {
  const [postComments, setPostComments] = useState<PostCommentDTO[] | null>(
    null,
  );

  useEffect(() => {
    apiFetch(`/posts/${postId}/comments`)
      .then(setPostComments)
      .catch((error) => alert(error.msg ?? error.message));
  }, [postId]);

  const writePostComment = (postId: number, content: string) => {
    return apiFetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: content }),
    }).then((res) => {
      alert(res.msg);
      setPostComments((prev) => [...(prev ?? []), res.data]);
    });
  };

  const deletePostComment = (postId: number, commentId: number) => {
    apiFetch(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    })
      .then((res) => {
        alert(res.msg);
        setPostComments(
          (prev) =>
            prev?.filter((comment) => comment.id !== commentId) ?? null,
        );
      })
      .catch((error) => alert(error.msg ?? error.message));
  };

  return { postComments, writePostComment, deletePostComment };
}
