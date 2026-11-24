import { alertError, apiFetch } from "@/app/lib/backend/client";
import { PostWithContentDTO } from "@/app/type/post";
import { useEffect, useState } from "react";

export default function usePost(id: number) {
  const [post, setPost] = useState<PostWithContentDTO | null>(null);
  // 불러오기에 실패하면 post가 계속 null이라 로딩 화면에 머무르므로 따로 표시
  const [isLoadFailed, setIsLoadFailed] = useState(false);

  useEffect(() => {
    apiFetch(`/posts/${id}`)
      .then(setPost)
      .catch((error) => {
        alertError(error);
        setIsLoadFailed(true);
      });
  }, [id]);

  const deletePost = (onSuccess: (data: { msg: string }) => void) => {
    apiFetch(`/posts/${id}`, {
      method: "DELETE",
    })
      .then(onSuccess)
      .catch(alertError);
  };

  return { post, isLoadFailed, deletePost };
}
