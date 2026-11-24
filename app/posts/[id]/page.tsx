"use client";
import Button from "@/app/components/Button";
import { PostCommentDTO, PostWithContentDTO } from "@/app/type/post";
import { useParams, useRouter } from "next/navigation";
import Loading from "./loading";
import usePost from "./_hooks/usePost";
import usePostComments from "./_hooks/usePostComments";

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
      <div className="whitespace-pre-line">content : {post.content}</div>

      <div className="flex gap-2 border-t mt-2 pt-2">
        <Button
          onClick={() =>
            confirm("글을 삭제 하시겠습니까?") && deletePost(post.id)
          }
        >
          delete
        </Button>
        <Button onClick={() => router.push(`/posts/${post.id}/edit`)}>
          edit
        </Button>
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
      <h2 className="mt-[18px]">comment write</h2>
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
        <Button type="submit">작성</Button>
      </form>

      <h2 className="mt-[18px] border-t pt-2">comment list</h2>
      {postComments == null && <div>댓글 로딩중...</div>}
      {postComments != null && postComments.length == 0 && (
        <div>댓글이 없습니다.</div>
      )}
      {postComments != null && postComments.length > 0 && (
        <ul>
          {postComments.map((comment) => (
            <li key={comment.id} className="flex items-center gap-2">
              {comment.id} : {comment.content}
              <Button
                onClick={() =>
                  confirm("댓글을 삭제 하시겠습니까?") &&
                  deletePostComment(post.id, comment.id)
                }
              >
                delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function Page() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = Number(rawId);

  const { post, deletePost } = usePost(id);
  const { postComments, writePostComment, deletePostComment } =
    usePostComments(id);

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
