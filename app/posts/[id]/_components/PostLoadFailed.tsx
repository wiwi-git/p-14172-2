"use client";

import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";

export default function PostLoadFailed() {
  const router = useRouter();

  const goToList = () => {
    router.push("/posts");
  };

  return (
    <div className="flex flex-col items-start gap-2 p-2">
      <div>글을 불러오지 못했습니다.</div>
      <Button onClick={goToList}>목록으로</Button>
    </div>
  );
}
