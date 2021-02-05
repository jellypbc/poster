export interface IPost {
  data: {
    attributes: IPostAttributes
    id: string
    relationships: IRelationships
    type: string
  }
  included: Array<ICitation>
}

export interface IRelationships {
  backlinks: any
  citations: any
  figures: any
  uploads: any
}

export interface IBodyCitation {
  from: number
  highlightedText: string
  id: number
  title: string
  to: number
  url: string
}

export interface IComment {
  from: number
  id: number
  text: string
  to: number
}

export interface IPostAttributes {
  authors: string
  body: string
  body_citations: Array<IBodyCitation>
  body_comments: Array<IComment>
  cable_url: string
  contributors: any
  created_at: string
  form_url: string
  id: number
  plugins: string
  publisher: string
  slug: string
  tags: Array<SimpleTag>
  title: string
  title_comments: Array<IComment>
  updated_at: string
  upload_url: string
}

export interface SimpleTag {
  id: string
  slug: string
  text: string
}

export interface ICurrentUser {
  data: {
    attributes: ICurrentUserAttributes
    id: string
    type: string
  }
}

export interface ICurrentUserCurrentUser {
  currentUser: {
    attributes: ICurrentUserAttributes
    id: string
    type: string
  }
}

export interface ICurrentUserAttributes {
  admin: boolean | null
  avatar_url: string
  email: string
  full_name: string
  guest: boolean
  id: string
  posts: Array<ICurrentUserAttributesPosts>
  username: string
}

export interface ICurrentUserAttributesPosts {
  0: number
  1: string
  2: string
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
  attributes: ICitationAttributes
  id: string
  type: string
}

export interface ICitationAttributes {
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

export interface ITagAttributes {
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

export interface ITag {
  data: {
    attributes: ITagAttributes
    id: string
    type: string
  }
}
