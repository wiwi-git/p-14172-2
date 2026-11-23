"use client";
import { useEffect, useState } from "react";
import { PostDTO } from "../type/post";
import { apiFetch } from "../lib/backend/client";
import Link from "next/link";
export default function Page() {
  const [posts, setPosts] = useState<PostDTO[] | null>(null);

  useEffect(() => {
    apiFetch("/posts").then(setPosts);
  }, []);

  return (
    <>
      <h1>post list</h1>

      {
        <ul>
          {posts?.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      }

      <div>
        <Link href="/posts/write">글쓰기</Link>
      </div>
    </>
  );
}
