import React from 'react'

export function PostMasthead({ post }) {
  const authors = post.data.attributes.authors || null

  return (
    <div>
      <div className="authors">{authors}</div>
    </div>
  )
}
