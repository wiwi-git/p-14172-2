"use client";

import Button from "@/app/components/Button";
import { alertError, apiFetch } from "@/app/lib/backend/client";
import { PostWithContentDTO } from "@/app/type/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";

export default function Page() {
  const router = useRouter();
  const { id: rawId } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithContentDTO | null>(null);

  useEffect(() => {
    const id = Number(rawId);
    apiFetch(`/posts/${id}`)
      .then(setPost)
      .catch(alertError);
  }, []);

  if (post == null) return Loading();

  const submitHandler = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const contentTextarea = form.elements.namedItem(
      "content",
    ) as HTMLTextAreaElement;
    const titleInput = form.elements.namedItem("title") as HTMLInputElement;

    const title = titleInput.value.trim();
    const content = contentTextarea.value.trim();

    if (title.length < 2) {
      alert("제목을 2자 이상 입력해주세요.");
      titleInput.focus();
      return;
    }

    if (content.length < 2) {
      alert("내용을 2자 이상 입력해주세요.");
      contentTextarea.focus();
      return;
    }

    apiFetch(`/posts/${post.id}`, {
      method: "PUT",
      body: JSON.stringify({ title: title, content: content }),
    })
      .then((res) => {
        alert(res.msg);
        router.replace(`/posts/${post.id}`);
      })
      .catch(alertError);
  };

  return (
    <>
      <form className="flex flex-col gap-2 p-2" onSubmit={submitHandler}>
        <input
          className="border p-2 rounded"
          type="text"
          name="title"
          placeholder="제목"
          maxLength={100}
          defaultValue={post.title}
        />
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="내용"
          maxLength={5000}
          rows={10}
          defaultValue={post.content}
        />
        <Button type="submit">
          저장
        </Button>
      </form>
    </>
  );
}
