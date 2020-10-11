import React from 'react'

export default function PostMasthead({ post }) {
  const authors = post.data.attributes.authors || null

  return (
    <div>
      <p className="authors">{authors}</p>
    </div>
  )
}
