import React, { useState } from 'react'
import { Comment } from './Comment'
import classnames from 'classnames'
import { CommentForm } from './CommentForm'
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/fontawesome-free-solid'

export function CommentContainer({
  comments,
  onSubmit,
  onDelete,
  currentUser,
  className,
  thread,
  highlightedText,
}) {
  const [isShowingReply, setIsShowingReply] = useState(false)

  const handleReply = () => {
    setIsShowingReply(true)
  }

  const handleReplyCancel = () => {
    setIsShowingReply(false)
  }

  const handleSubmit = (payload, comment) => {
    onSubmit(payload, comment)
  }

  return (
    <div>
      {comments.length !== 0 && (
        <div>
          <FontAwesomeIcon icon={faComment} /> {comments.length}
        </div>
      )}
      {comments.length !== 0 && (
        <div>
          <ul className="commentList">
            {highlightedText && (
              <div
                className="m-3"
                style={{ backgroundColor: '#B8E986', fontSize: '.8rem' }}
              >
                {highlightedText}
              </div>
            )}
            {comments.map((c, index) => {
              const comment = c.spec.comment
              const isLast = index === comments.length - 1
              return (
                <div key={uuidv4()}>
                  <Comment
                    key={index}
                    comment={comment}
                    className={classnames('px-3 ', {
                      'border-bottom': !isLast,
                    })}
                    onDelete={onDelete}
                    currentUser={currentUser}
                  />
                  <div>
                    {!isShowingReply && (
                      <div className="j-replyContainer">
                        {isLast && (
                          <div className="j-openReplyForm p-3">
                            <div className="j-commentUser">
                              <div className="name-card">
                                <img
                                  className="avatar"
                                  src={currentUser.avatar}
                                  alt={currentUser.username}
                                />
                                <textarea
                                  className="reply-button"
                                  placeholder="What's on your mind..."
                                  diabled="true"
                                  onClick={handleReply}
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {isShowingReply && (
                      <div className="j-replyContainer">
                        {isLast && (
                          <div className="reply-box pt-2 pl-3 pr-3">
                            <CommentForm
                              comment={comment}
                              thread={thread}
                              onSubmit={handleSubmit}
                              onCancel={handleReplyCancel}
                              className="j-commentReplyForm mt-3 pt-1 animated fadeIn"
                              currentUser={currentUser}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
