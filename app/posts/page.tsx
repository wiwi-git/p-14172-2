"use client";
import { useEffect, useState } from "react";
import { PostDTO } from "../type/post";
import { get } from "../lib/backend/client";

export default function Page() {
  const [posts, setPosts] = useState<PostDTO[] | null>(null);

  useEffect(() => {
    get("/api/v1/posts").then(setPosts);
  }, []);

  return (
    <>
      <h1>post list</h1>

      {
        <ul>
          {posts?.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      }
    </>
  );
}
