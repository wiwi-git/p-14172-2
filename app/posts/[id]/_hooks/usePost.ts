import { apiFetch } from "@/app/lib/backend/client";
import { PostWithContentDTO } from "@/app/type/post";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function usePost(id: number) {
  const router = useRouter();
  const [post, setPost] = useState<PostWithContentDTO | null>(null);

  useEffect(() => {
    apiFetch(`/posts/${id}`)
      .then(setPost)
      .catch((error) => alert(error.msg ?? error.message));
  }, [id]);

  const deletePost = () => {
    apiFetch(`/posts/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        alert(res.msg);
        router.replace("/posts");
      })
      .catch((error) => alert(error.msg ?? error.message));
  };

  return { post, deletePost };
}
