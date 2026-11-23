export type PostDTO = {
  id: number;
  createDate: string;
  modifyDate: string;
  title: string;
};

export type PostWithContentDTO = PostDTO & { content: string };

export type PostCommentDTO = {
  id: number;
  createDate: string;
  modifyDate: string;
  content: string;
};
