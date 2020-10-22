import React from 'react'

export default function PostMasthead({ post }) {
  const authors = post.data.attributes.authors || null

  return (
    <div>
      <div className="authors">{authors}</div>
    </div>
  )
}
