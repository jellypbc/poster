import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

function CommentForm() {
  const dispatch = useDispatch()
  const comments = useSelector(state => state.comments)
  const textarea = React.useRef()

  // TODO: It might be a good idea to separate visibility check into a parent
  // component to keep this component solely concerned with internal state & layout.
  const modifierClasses = !comments.isAddingComment
    ? 'j-commentForm--inactive'
    : ''

  return (
    <div className={`j-commentForm shadow rounded ${modifierClasses}`}>
      <textarea
        className="j-commentForm__input px-2 py-2"
        defaultValue=""
        placeholder="Comment..."
        ref={textarea}
      ></textarea>
      <div className="j-commentForm__actions px-2 pt-1 pb-2 d-flex flex-row-reverse">
        <div className="">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => dispatch({ type: 'addCommentCancel' })}
          >
            Cancel
          </button>{' '}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => dispatch({ type: 'addCommentSave' })}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentForm
