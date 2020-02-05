import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

function CommentForm() {
  const dispatch = useDispatch()
  const comments = useSelector(state => state.comments)
  const textareaRef = React.useRef()

  const getSavePayload = () => {
    return { text: textareaRef.current.value }
  }

  // TODO: It might be a good idea to separate visibility check into a parent
  // component to keep this component solely concerned with internal state & layout.
  const modifierClasses = !comments.isAddingComment
    ? 'j-commentForm--inactive'
    : ''

  return (
    <div className={`j-commentForm shadow rounded ${modifierClasses}`}>
      <textarea
        className="j-commentForm__input px-3 py-3"
        defaultValue=""
        placeholder="Comment..."
        ref={textareaRef}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus
        id="comment-form-input"
      ></textarea>
      <div className="j-commentForm__actions px-2 pt-1 pb-2 d-flex flex-row-reverse">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            dispatch({ type: 'addCommentSave', payload: getSavePayload() })
            textareaRef.current.value = '' // clear (could change this to controlled value too)
          }}
        >
          Post
        </button>{' '}
        <button
          type="button"
          className="btn btn-sm o"
          onClick={() => dispatch({ type: 'addCommentCancel' })}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default CommentForm
