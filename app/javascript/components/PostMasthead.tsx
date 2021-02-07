import * as React from 'react'
import type { IPost } from './types'

interface Props {
  post: IPost
}

export const PostMasthead: React.FC<Props> = ({ post }) => {
  const authors = post.data.attributes.authors || null

  return (
    <div>
      <div className="authors">{authors}</div>
    </div>
  )
}
