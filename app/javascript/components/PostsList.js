import React from 'react'
import { PostCard } from './PostCard'

export default function PostsList({ posts }) {
  const postElements = posts.map((post) => {
    return <PostCard key={post.id} post={post} />
  })

  return <>{postElements}</>
}
