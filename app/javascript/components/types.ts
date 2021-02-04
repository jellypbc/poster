export interface IPost {
  data: {
    attributes: IPostAttributes
    id: string
    relationships: any
    type: string
  }
  included: Array<any>
}

export interface IPostAttributes {
  authors: string
  body: string
  body_citations: Array<any>
  body_comments: Array<any>
  cable_url: string
  contributors: any
  created_at: string
  form_url: string
  id: number
  plugins: string
  publisher: string
  slug: string
  tags: any
  title: string
  title_comments: Array<any>
  updated_at: string
  upload_url: string
}

export interface ICurrentUser {
  data: {
    attributes: ICurrentUserAttributes
    id: string
    type: string
  }
}

export interface ICurrentUserAttributes {
  admin: any
  avatar_url: string
  email: string
  full_name: string
  guest: boolean
  id: string
  posts: any
  username: string
}

export interface IMenu {
  comments: any
  marks: any
}

export interface IPostCard {
  abstract: string
  authors: string
  body: string
  created_at: string
  deleted_at: string
  id: number
  imprint_date: string
  imprint_type: string
  plugins: string
  publish_date: string
  published_at: string
  publisher: string
  slug: string
  title: string
  updated_at: string
  user_id: number
  visibility: string
}

export interface IBacklink {
  attributes: {
    authors: string
    generated_post_id: number
    id: number
    imprint_date: string
    imprint_type: string
    post_id: number
    publisher: string
    source_post_path: string
    title: string
  }
  id: string
  type: string
}

export interface ICitation {
  attributes: {
    authors: string
    body: string
    generated_post_id: number
    generated_post_path: string
    id: number
    imprint_date: string
    imprint_type: string
    post_id: number
    publisher: string
    target: string
    title: string
  }
  id: string
  type: string
}

export interface ITag {
  color: string
  created_at: string
  description: string
  id: number
  posts_count: number
  slug: string
  text: string
  updated_at: string
  user_id: number
}