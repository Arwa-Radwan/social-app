export interface IPosts {
  _id: string;
  id: string;
  body?: string;
  image?: string;
  privacy: 'public' | 'friends' | 'only_me' | string;
  user: PostUser;
  likes?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  topComment: any | null;

  bookmarked: boolean;
  createdAt: string;
  sharedPost?: IPosts | null;
isShare?: boolean;

}
export interface PostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
export interface Iuser {
  _id: string
  name: string
  username: string
  email: string
  photo: string
  cover: string
}