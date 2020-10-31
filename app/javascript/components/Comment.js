import React from 'react'
import classnames from 'classnames'

export function Comment({ comment, className }) {
  // TODO: put delete back in
  // const handleDelete = () => {
  //   dispatch(
  //     state.tr.setMeta(commentPlugin, { type: 'deleteComment', comment })
  //   )
  // }

  return (
    <div
      className={classnames('commentShow', className)}
      id={'comment-' + comment.id}
    >
      {comment.user && (
        <div className="j-commentUser">
          <a
            className="name-card"
            href={comment.user.username ? '/@' + comment.user.username : '#'}
            target="blank"
          >
            <img
              className="avatar"
              src={comment.user.avatar}
              alt={comment.user.username}
            />
            {comment.user.username}
          </a>
        </div>
      )}
      <p className="j-commentText">{comment.text}</p>
    </div>
  )
}
