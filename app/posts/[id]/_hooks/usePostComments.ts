import { alertError, apiFetch } from "@/app/lib/backend/client";
import { PostCommentDTO } from "@/app/type/post";
import { useEffect, useState } from "react";

export default function usePostComments(postId: number) {
  const [postComments, setPostComments] = useState<PostCommentDTO[] | null>(
    null,
  );

  useEffect(() => {
    apiFetch(`/posts/${postId}/comments`)
      .then(setPostComments)
      .catch(alertError);
  }, [postId]);

  const writePostComment = (
    content: string,
    onSuccess: (data: { msg: string }) => void,
  ) => {
    apiFetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: content }),
    })
      .then((data) => {
        setPostComments((prev) => [...(prev ?? []), data.data]);

        onSuccess(data);
      })
      .catch(alertError);
  };

  const modifyPostComment = (
    commentId: number,
    content: string,
    onSuccess: (data: { msg: string }) => void,
  ) => {
    apiFetch(`/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ content: content }),
    })
      .then((data) => {
        // 응답에 수정된 댓글이 없어서 목록의 내용만 직접 바꿈
        setPostComments(
          (prev) =>
            prev?.map((comment) =>
              comment.id === commentId ? { ...comment, content } : comment,
            ) ?? null,
        );

        onSuccess(data);
      })
      .catch(alertError);
  };

  const deletePostComment = (
    commentId: number,
    onSuccess: (data: { msg: string }) => void,
  ) => {
    apiFetch(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    })
      .then((data) => {
        setPostComments(
          (prev) =>
            prev?.filter((comment) => comment.id !== commentId) ?? null,
        );

        onSuccess(data);
      })
      .catch(alertError);
  };

  return {
    postId,
    postComments,
    writePostComment,
    modifyPostComment,
    deletePostComment,
  };
}
