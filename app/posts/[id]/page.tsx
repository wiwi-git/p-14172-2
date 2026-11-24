"use client";
import Button from "@/app/components/Button";
import { PostWithContentDTO } from "@/app/type/post";
import { useParams, useRouter } from "next/navigation";
import Loading from "./loading";
import usePost from "./_hooks/usePost";
import usePostComments from "./_hooks/usePostComments";

// 훅의 post는 null일 수 있지만, 컴포넌트는 로딩이 끝난 post만 받음
type LoadedPost = { post: PostWithContentDTO };

function PostInfo({
  post,
  deletePost: _deletePost,
}: ReturnType<typeof usePost> & LoadedPost) {
  const router = useRouter();

  const deletePost = () => {
    if (!confirm("글을 삭제 하시겠습니까?")) return;

    _deletePost(post.id);
  };

  const editPost = () => {
    router.push(`/posts/${post.id}/edit`);
  };

  return (
    <>
      <h1>post</h1>
      <div>id : {post.id}</div>
      <div>title : {post.title}</div>
      <div className="whitespace-pre-line">content : {post.content}</div>

      <div className="flex gap-2 border-t mt-2 pt-2">
        <Button onClick={deletePost}>delete</Button>
        <Button onClick={editPost}>edit</Button>
      </div>
    </>
  );
}

type PostCommentsProps = ReturnType<typeof usePostComments> & LoadedPost;

function PostCommentWrite({
  post,
  writePostComment: _writePostComment,
}: PostCommentsProps) {
  const writePostComment = (event: React.SyntheticEvent<HTMLFormElement>) => {
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

    _writePostComment(post.id, content)
      .then(() => form.reset())
      .catch((error) => alert(error.msg ?? error.message));
  };

  return (
    <>
      <h2 className="mt-[18px]">comment write</h2>
      <form className="flex flex-col gap-2 p-2" onSubmit={writePostComment}>
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="댓글 내용"
          maxLength={100}
          rows={3}
        />
        <Button type="submit">작성</Button>
      </form>
    </>
  );
}

function PostCommentList({
  post,
  postComments,
  deletePostComment: _deletePostComment,
}: PostCommentsProps) {
  const deletePostComment = (commentId: number) => {
    if (!confirm("댓글을 삭제 하시겠습니까?")) return;

    _deletePostComment(post.id, commentId);
  };

  return (
    <>
      <h2 className="mt-[18px] border-t pt-2">comment list</h2>
      {postComments != null && postComments.length == 0 && (
        <div>댓글이 없습니다.</div>
      )}
      {postComments != null && postComments.length > 0 && (
        <ul>
          {postComments.map((comment) => (
            <li key={comment.id} className="flex items-center gap-2">
              {comment.id} : {comment.content}
              <Button onClick={() => deletePostComment(comment.id)}>
                delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function PostCommentWriteAndList(props: PostCommentsProps) {
  return (
    <>
      <PostCommentWrite {...props} />
      <PostCommentList {...props} />
    </>
  );
}

export default function Page() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = Number(rawId);

  const postState = usePost(id);
  const postCommentsState = usePostComments(id);

  const { post } = postState;
  if (post == null) return Loading();

  return (
    <>
      <PostInfo {...postState} post={post} />
      <PostCommentWriteAndList {...postCommentsState} post={post} />
    </>
  );
}
