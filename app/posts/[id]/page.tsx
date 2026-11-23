"use client";
import { apiFetch } from "@/app/lib/backend/client";
import { PostCommentDTO, PostWithContentDTO } from "@/app/type/post";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "./loading";

export default function Page() {
  const router = useRouter();
  const { id: rawId } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithContentDTO | null>(null);
  const [postComments, setPostComments] = useState<PostCommentDTO[] | null>(
    null,
  );

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
    apiFetch(`/posts/${id}/comments`).then(setPostComments);
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
      <div>
        <button onClick={() => router.push(`/posts/${post.id}/edit`)}>
          edit
        </button>
      </div>

      <h2>comment list</h2>
      {postComments == null && <div>댓글 로딩중...</div>}
      {postComments != null && postComments.length == 0 && (
        <div>댓글이 없습니다.</div>
      )}
      {postComments != null && postComments.length > 0 && (
        <ul>
          {postComments.map((comment) => (
            <li key={comment.id}>
              {comment.id} : {comment.content}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
