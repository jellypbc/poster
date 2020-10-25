import React from 'react'
import { PostCard } from './PostCard'

export default function PostsList({ posts }) {
  console.log('posts', posts)
  const postElements = posts.map((post) => {
    return (
      <PostCard
        key={post.id}
        postPath="/hello"
        title={post.title}
        authors={post.authors}
        abstract={post.abstract}
        createdAt={post.created_at}
        updatedAt={post.updated_at}
      />
    )
  })

  return <>{postElements}</>
}

// / - @posts.each do |post|
// /   = react_component "PostCard",
// /     key: post.id,
// /     postPath: post.user_id? ? short_user_post_path(post.user, post) : post_path(post),
// /     title: post.title.present? ? sanitize_title(post.title).html_safe : post.title,
// /     authors: post.authors,
// /     abstract: post.abstract.present? ? post.abstract.truncate(200, seperator: "...") : post.abstract,
// /     createdAt: post.created_at.present? ? post.created_at.strftime("%b %d, %Y") : post.created_at,
// /     updatedAtInWords: post.updated_at.present? ? time_ago_in_words(post.updated_at) : post.updated_at,
// /     post: post
