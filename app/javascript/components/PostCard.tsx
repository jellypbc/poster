import React from 'react'
import { format, formatDistance } from 'date-fns'
import sanitizeHtml from 'sanitize-html'
import type { IPostCard } from './types'

interface Props {
  post: IPostCard
}

export const PostCard: React.FC<Props> = ({ post }) => {
  console.log('postcar', post)
  const sanitizedTitle = () => {
    const title =
      post.title !== null
        ? sanitizeHtml(post.title, {
            allowedTags: ['b', 'sup', 'sub', 'em', 'code'],
            allowedAttributes: {},
          })
        : 'Untitled'
    return { __html: title }
  }

  const updatedAtTimeAgoInWords = () => {
    return post.updated_at !== null
      ? `Last updated ` +
          formatDistance(
            new Date(post.updated_at),
            new Date(Date.now()),
            { addSuffix: true }
          )
      : ``
  }

  const createdAtDate = () => {
    return format(new Date(post.created_at), 'MMM dd, yyyy')
  }

  const truncatedAbstract = () => {
    return post.abstract !== null && post.abstract !== ''
      ? post.abstract.slice(0, 200) + `...`
      : ``
  }

  const postPath = () => {
    return `../../posts/` + post.slug
  }

  const dragStart = (event) => {
    event.dataTransfer.setData('postID', post.id)
    event.dataTransfer.setData('postSlug', post.slug)
    event.dataTransfer.effectAllowed = 'effect'
    event.target.style.backgroundColor = 'white'
    event.target.style.opacity = '0.6'
    event.target.style.borderColor = '#bbb'
  }

  const dragEnd = (event) => {
    event.target.style.backgroundColor = ''
    event.target.style.cursor = 'default'
    event.target.style.opacity = '1'
    event.target.style.borderColor = 'transparent'
  }

  return (
    <>
      <a href={postPath()}>
        <div
          id={'post-' + post.id}
          className="post-row"
          draggable="true"
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e)}
        >
          <h4 className="title" dangerouslySetInnerHTML={sanitizedTitle()}></h4>
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
