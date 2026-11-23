"use client";

import { apiFetch } from "@/app/lib/backend/client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

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

    apiFetch("/posts", {
      method: "POST",
      body: JSON.stringify({ title: title, content: content }),
    }).then((res) => {
      alert(res.msg);
      router.replace(`/posts/${res.data.id}`);
    });
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
        />
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="내용"
          maxLength={5000}
          rows={10}
        />
        <button className="border p-2 rounded" type="submit">
          저장
        </button>
      </form>
    </>
  );
}
