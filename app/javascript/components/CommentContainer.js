import React, { useState } from 'react'
import { Comment } from './Comment'
import classnames from 'classnames'
import { CommentForm } from './CommentForm'
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/fontawesome-free-solid'

export function CommentContainer({ comments, onSubmit }) {
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
        <ul className="commentList">
          {comments.map((c, index) => {
            const comment = c.spec.comment
            const isLast = index === comments.length - 1
            return (
              <div key={uuidv4()}>
                <Comment
                  key={index}
                  comment={comment}
                  className={classnames('px-3 ', { 'border-bottom': !isLast })}
                />
                <div>
                  {!isShowingReply && (
                    <div className="j-replyContainer">
                      {isLast && (
                        <div className="j-openReplyForm p-3">
                          <div className="j-commentUser">
                            <button className="name-card" onClick={handleReply}>
                              <img
                                className="avatar"
                                src={comment.user.avatar} // TODO: show current usre or guest avatar
                                alt={comment.user.username}
                              />
                              <textarea
                                className="reply-button"
                                placeholder="What's on your mind..."
                                diabled="true"
                              ></textarea>
                            </button>
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
                            onSubmit={handleSubmit}
                            onCancel={handleReplyCancel}
                            className="j-commentReplyForm mt-3 pt-1 animated fadeIn"
                            comment={comment}
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
      )}
    </div>
  )
}
