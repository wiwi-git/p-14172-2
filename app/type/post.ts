export type PostDTO = {
  id: number;
  createDate: string;
  modifyDate: string;
  title: string;
};

export type PostWithContentDTO = PostDTO & { content: string };
