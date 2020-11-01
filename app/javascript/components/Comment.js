import React from 'react'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/fontawesome-free-solid'

export function Comment({ comment, className, onDelete, currentUser }) {
  const handleClick = () => {
    if (onDelete) onDelete(comment)
  }

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
          {comment.user.username === currentUser.username && (
            <button
              className="btn btn-plain btn-sm j-commentDelete px-2 mr-2"
              onClick={handleClick}
            >
              <FontAwesomeIcon icon={faEllipsisH} />
            </button>
          )}
        </div>
      )}
      <p className="j-commentText">{comment.text}</p>
    </div>
  )
}
