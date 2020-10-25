import React from 'react'
import { format, formatDistance } from 'date-fns'
import sanitizeHtml from 'sanitize-html'

export function PostCard(props) {
  const { postPath, title, authors, abstract, createdAt, updatedAt } = props

  const sanitizedTitle = () => {
    return title !== null
      ? sanitizeHtml(title, {
          allowedTags: ['b', 'sup', 'sub', 'em', 'code'],
          allowedAttributes: {},
        })
      : ``
  }

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

  // TODO: fix ... showing for abstracts that are probably <p></p>
  const truncatedAbstract = () => {
    return abstract !== null ? abstract.slice(0, 200) + `...` : ``
  }

  return (
    <>
      <a href={postPath}>
        <div className="post-row">
          <h4 className="title">{sanitizedTitle()}</h4>
          <p className="authors">{authors}</p>
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
