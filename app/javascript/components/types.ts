export interface Post {
  data: {
    attributes: PostAttributes
    id: string
  }
  included: Array<any>
}

export interface PostAttributes {
  abstract: any
  authors: any
  body: string
  body_citations: any
  body_comments: any
  created_at: string
  deleted_at: string
  form_url: any
  id: number
  imprint_date: any
  imprint_type: any
  plugins: any
  publish_date: any
  published_at: any
  publisher: any
  slug: string
  title: string
  title_comments: string
  updated_at: string
  upload_url: string
  user_id: number
  visibility: string
}

export interface CurrentUser {
  data: {
    attributes: {
      id: string
      username: string
    }
  }
}



// attributes:
// authors: "Andy Matuschak"
// body: "<p>2020 was my second year as an “independent rese"
// body_citations: []
// body_comments: []
// cable_url: "ws://localhost:3000/cable"
// contributors: null
// created_at: "2021-01-19T04:50:59.065Z"
// form_url: "/posts/arhkoz-reflections-on-2020-as-an-independent-researcher"
// id: 4
// plugins: "{}"
// publisher: ""
// slug: "arhkoz-reflections-on-2020-as-an-independent-researcher"
// tags: []
// title: "<p>Reflections on 2020 as an independent researcher</p>"
// title_comments: []
// updated_at: "2021-01-19T04:51:19.853Z"
// upload_url: null