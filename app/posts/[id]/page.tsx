"use client";
import { apiFetch } from "@/app/lib/backend/client";
import { PostWithContentDTO } from "@/app/type/post";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "./loading";

export default function Page() {
  const { id: rawId } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithContentDTO | null>(null);

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
    </>
  );
}
