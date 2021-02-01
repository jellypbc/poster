export interface IPost {
  data: {
    attributes: PostAttributes
    id: string
    relationships: any
    type: string
  }
  included: Array<any>
}

export interface PostAttributes {
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
  title: string
  title_comments: Array<any>
  updated_at: string
  upload_url: string
}

export interface ICurrentUser {
  data: {
    attributes: {
      admin: any
      avatar_url: string
      email: string
      full_name: string
      guest: boolean
      id: string
      posts: any
      username: string
    }
    id: string
    type: string
  }
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
