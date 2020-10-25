import React from 'react'
import { PostCard } from './PostCard'

export default function PostsList({ posts }) {
  // TODO: replace `@cindy/`
  const postPath = (post) => {
    return `@cindy/` + post.slug
  }

  const postElements = posts.map((post) => {
    return (
      <PostCard
        key={post.id}
        title={post.title}
        authors={post.authors}
        abstract={post.abstract}
        createdAt={post.created_at}
        updatedAt={post.updated_at}
        postPath={postPath(post)}
      />
    )
  })

  return <>{postElements}</>
}
