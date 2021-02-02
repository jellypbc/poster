import React from 'react'
import { PostCard } from './PostCard'
import type { IPostCard } from './types'

interface Props {
  posts: Array<IPostCard>
}

export const PostsList: React.FC<Props> = ({ posts }) => {
  const postElements = posts.map((post) => {
    return <PostCard key={post.id} post={post} />
  })

  return <>{postElements}</>
}
