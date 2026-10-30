export interface Root {
  user: IProfile
}

export interface IProfile {
  _id: string
  name: string
  username: string
  email: string
  dateOfBirth: string
  gender: string
  photo: string
  cover: string
  bookmarks: any[]
  followers: any[]
  following: any[]
  createdAt: string
  passwordChangedAt: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}
export type Root1 = Root2[]

export interface Root2 {
  _id: string
  body: string
  privacy: string
//   user: User
//   sharedPost: SharedPost
  likes: string[]
  createdAt: string
  commentsCount: number
//   topComment: TopComment
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
}