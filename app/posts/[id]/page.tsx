"use client";
import { apiFetch } from "@/app/lib/backend/client";
import { PostCommentDTO, PostWithContentDTO } from "@/app/type/post";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "./loading";

function PostInfo({
  post,
  deletePost,
}: {
  post: PostWithContentDTO;
  deletePost: (id: number) => void;
}) {
  const router = useRouter();

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
    </>
  );
}

function PostCommentWriteAndList({
  post,
  postComments,
  writePostComment,
  deletePostComment,
}: {
  post: PostWithContentDTO;
  postComments: PostCommentDTO[] | null;
  writePostComment: (postId: number, content: string) => Promise<void>;
  deletePostComment: (postId: number, commentId: number) => void;
}) {
  const commentWriteSubmitHandler = (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const contentTextarea = form.elements.namedItem(
      "content",
    ) as HTMLTextAreaElement;

    const content = contentTextarea.value.trim();

    if (content.length < 2) {
      alert("댓글을 2자 이상 입력해주세요.");
      contentTextarea.focus();
      return;
    }

    writePostComment(post.id, content)
      .then(() => form.reset())
      .catch((error) => alert(error.msg ?? error.message));
  };

  return (
    <>
      <h2>comment write</h2>
      <form
        className="flex flex-col gap-2 p-2"
        onSubmit={commentWriteSubmitHandler}
      >
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="댓글 내용"
          maxLength={100}
          rows={3}
        />
        <button className="border p-2 rounded" type="submit">
          작성
        </button>
      </form>

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
              <button
                onClick={() =>
                  confirm("댓글을 삭제 하시겠습니까?") &&
                  deletePostComment(post.id, comment.id)
                }
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

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
    })
      .then((res) => {
        alert(res.msg);
        router.replace("/posts");
      })
      .catch((error) => alert(error.msg ?? error.message));
  };

  const deletePostComment = (postId: number, commentId: number) => {
    apiFetch(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    })
      .then((res) => {
        alert(res.msg);
        setPostComments(
          (prev) =>
            prev?.filter((comment) => comment.id !== commentId) ?? null,
        );
      })
      .catch((error) => alert(error.msg ?? error.message));
  };

  const writePostComment = (postId: number, content: string) => {
    return apiFetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: content }),
    }).then((res) => {
      alert(res.msg);
      setPostComments((prev) => [...(prev ?? []), res.data]);
    });
  };

  useEffect(() => {
    const id = Number(rawId);
    apiFetch(`/posts/${id}`)
      .then(setPost)
      .catch((error) => alert(error.msg ?? error.message));
    apiFetch(`/posts/${id}/comments`)
      .then(setPostComments)
      .catch((error) => alert(error.msg ?? error.message));
  }, []);

  if (post == null) return Loading();

  return (
    <>
      <PostInfo post={post} deletePost={deletePost} />
      <PostCommentWriteAndList
        post={post}
        postComments={postComments}
        writePostComment={writePostComment}
        deletePostComment={deletePostComment}
      />
    </>
  );
}
