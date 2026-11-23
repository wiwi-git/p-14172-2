"use client";
import { apiFetch } from "@/app/lib/backend/client";
import { PostWithContentDTO } from "@/app/type/post";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "./loading";

export default function Page() {
  const router = useRouter();
  const { id: rawId } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithContentDTO | null>(null);

  const deletePost = (id: number) => {
    apiFetch(`/posts/${id}`, {
      method: "DELETE",
    }).then((res) => {
      alert(res.msg);
      router.replace("/posts");
    });
  };

  useEffect(() => {
    const id = Number(rawId);
    apiFetch(`/posts/${id}`).then(setPost);
  }, []);

  if (post == null) return Loading();

  return (
    <>
      <h1>post</h1>
      <div>id : {post.id}</div>
      <div>title : {post.title}</div>

      <div>
        <button
          onClick={() =>
            confirm("글을 삭제 하시겠습니까?") && deletePost(post.id)
          }
        >
          delete
        </button>
      </div>
    </>
  );
}
