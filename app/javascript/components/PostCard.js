import React from 'react'
import { format, formatDistance } from 'date-fns'
import sanitizeHtml from 'sanitize-html'

export function PostCard({ post }) {
  const sanitizedTitle = () => {
    return post.title !== null
      ? sanitizeHtml(post.title, {
          allowedTags: ['b', 'sup', 'sub', 'em', 'code'],
          allowedAttributes: {},
        })
      : ``
  }

  const updatedAtTimeAgoInWords = () => {
    return post.updated_at !== null
      ? `Last updated ` +
          // eslint-disable-next-line prettier/prettier
          formatDistance(
            new Date(post.updated_at),
            new Date(Date.now()),
            // eslint-disable-next-line prettier/prettier
            { addSuffix: true }
          )
      : ``
  }

  const createdAtDate = () => {
    return format(new Date(post.created_at), 'MMM dd, yyyy')
  }

  // CINDY TODO: replace post.abstract with post.body (only p tag content)
  const truncatedAbstract = () => {
    return post.abstract !== null && post.abstract !== ''
      ? post.abstract.slice(0, 200) + `...`
      : ``
  }

  const postPath = () => {
    return `posts/` + post.slug
  }

  return (
    <>
      <a href={postPath()}>
        <div className="post-row">
          <h4 className="title">{sanitizedTitle()}</h4>
          <p className="authors">{post.authors}</p>
          <p className="preview">{truncatedAbstract()}</p>
          <p className="date">
            <span>Added on {createdAtDate()}</span>
            <span className="ml-3">{updatedAtTimeAgoInWords()}</span>
          </p>
        </div>
      </a>
    </>
  )
}
