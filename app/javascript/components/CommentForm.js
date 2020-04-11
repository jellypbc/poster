import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'

function CommentForm({ onSubmit, onCancel, className, ...rest }) {
  // const dispatch = useDispatch()
  // const comments = useSelector(state => state.comments)
  const textareaRef = React.useRef()

  const getSavePayload = () => {
    return { text: textareaRef.current.value }
  }

  // TODO: It might be a good idea to separate visibility check into a parent
  // component to keep this component solely concerned with internal state & layout.
  // const modifierClasses = !comments.isAddingComment
  //   ? 'j-commentForm--inactive'
  //   : ''
  const modifierClasses = ''

  const handleSubmit = () => {
    const payload = getSavePayload()
    console.log ('submit', payload)
    // dispatch({ type: 'addCommentSave', payload })
    textareaRef.current.value = '' // clear (could change this to controlled value too)
    if (onSubmit) onSubmit(payload)
  }

  const handleCancel = () => {
    // dispatch({ type: 'addCommentCancel' })
    if (onCancel) onCancel()
  }

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
      handleSubmit()
    }
    if (e.keyCode === 27) {
      handleCancel()
    }
  }

  return (
    <form
      className={`${className} ${modifierClasses}`}
      {...rest}
      onSubmit={handleSubmit}
    >
      <textarea
        className="j-commentForm__input"
        defaultValue=""
        placeholder="Add a comment..."
        onKeyDown={handleKeyDown}
        ref={textareaRef}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus
        id="comment-form-input"
      ></textarea>
      <div className="j-commentForm__actions px-2 pt-1 pb-2 d-flex flex-row-reverse">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleSubmit}
        >
          Post
        </button>{' '}
        <button type="button" className="btn btn-sm o" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CommentForm
