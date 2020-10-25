import React from 'react'
import { format, formatDistance } from 'date-fns'

export function PostCard(props) {
  const { postPath, title, authors, abstract, createdAt, updatedAt } = props

  const updatedAtTimeAgoInWords = () => {
    return updatedAt !== null
      ? `Last updated ` +
          // eslint-disable-next-line prettier/prettier
          formatDistance(
            new Date(updatedAt),
            new Date(Date.now()),
            // eslint-disable-next-line prettier/prettier
            { addSuffix: true }
          )
      : ``
  }

  const createdAtDate = () => {
    return format(new Date(createdAt), 'MMM dd, yyyy')
  }

  return (
    <>
      <a href={postPath}>
        <div className="post-row">
          <h4 className="title">{title}</h4>
          <p className="authors">{authors}</p>
          <p className="preview">{abstract}</p>
          <p className="date">
            <span>Added on {createdAtDate()}</span>
            <span className="ml-3">{updatedAtTimeAgoInWords()}</span>
          </p>
        </div>
      </a>
    </>
  )
}
