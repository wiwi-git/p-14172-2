"use client";
import { useEffect, useState } from "react";
import { PostDTO } from "../type/post";
import { apiFetch } from "../lib/backend/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
export default function Page() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostDTO[] | null>(null);

  useEffect(() => {
    apiFetch("/posts")
      .then(setPosts)
      .catch((error) => alert(error.msg ?? error.message));
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

      <div className="border-t mt-2 pt-2">
        <Button onClick={() => router.push("/posts/write")}>글쓰기</Button>
      </div>
    </>
  );
}
