import { alertError, apiFetch } from "@/app/lib/backend/client";
import { PostWithContentDTO } from "@/app/type/post";
import { useEffect, useState } from "react";

export default function usePost(id: number) {
  const [post, setPost] = useState<PostWithContentDTO | null>(null);

  useEffect(() => {
    apiFetch(`/posts/${id}`).then(setPost).catch(alertError);
  }, [id]);

  const deletePost = (onSuccess: (data: { msg: string }) => void) => {
    apiFetch(`/posts/${id}`, {
      method: "DELETE",
    })
      .then(onSuccess)
      .catch(alertError);
  };

  return { post, deletePost };
}
