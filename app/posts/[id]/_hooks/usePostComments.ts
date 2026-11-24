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

  const writePostComment = (content: string) => {
    return apiFetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: content }),
    }).then((res) => {
      alert(res.msg);
      setPostComments((prev) => [...(prev ?? []), res.data]);
    });
  };

  const modifyPostComment = (commentId: number, content: string) => {
    return apiFetch(`/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ content: content }),
    }).then((res) => {
      alert(res.msg);
      // 응답에 수정된 댓글이 없어서 목록의 내용만 직접 바꿈
      setPostComments(
        (prev) =>
          prev?.map((comment) =>
            comment.id === commentId ? { ...comment, content } : comment,
          ) ?? null,
      );
    });
  };

  const deletePostComment = (commentId: number) => {
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

  return {
    postId,
    postComments,
    writePostComment,
    modifyPostComment,
    deletePostComment,
  };
}
