import React, { useState, useEffect, useRef } from 'react'
import { store } from '../store'
import { saRequest } from '../utils/saRequest'
import { autogrow } from '../utils/autogrow'

// import { useSelector, useDispatch } from 'react-redux'

function useForceUpdate() {
  const [, setValue] = useState(0)
  return () => setValue((value) => ++value)
}

export function CommentForm(props) {
  const { thread, onSubmit, onCancel, className, comment, text } = props
  // const dispatch = useDispatch()
  // const comments = useSelector(state => state.comments)
  const textareaRef = useRef()
  let { currentUser } = store.getState()

  useEffect(() => {
    autogrow()
  }, [])

  const getSavePayload = () => {
    return {
      text: textareaRef.current.value,
    }
  }

  const forceUpdate = useForceUpdate()

  // TODO: It might be a good idea to separate visibility check into a parent
  // component to keep this component solely concerned with internal state & layout.
  // const modifierClasses = !comments.isAddingComment
  //   ? 'j-commentForm--inactive'
  //   : ''
  const modifierClasses = ''

  const handleSubmit = () => {
    const payload = getSavePayload()
    console.log('comment', comment)

    textareaRef.current.value = '' // clear (could change this to controlled value too)
    if (onSubmit) onSubmit(payload, comment)
  }

  const onGuestClick = (e) => {
    // send a request to create a user
    let data = { user: { guest: true } }
    let url = '/guestcreate'
    const payload = getSavePayload()
    saRequest
      .post(url)
      .send(data)
      .set('accept', 'application/json')
      .end((err, res) => {
        console.log({ res, err }) // DEBUG SAVE

        if (res.status === 200) {
          store.dispatch({ type: 'setCurrentUser', payload: res.body })
          // TODO: i don't think forceUpdate() is working... maybe use useEffect?
          forceUpdate()
          textareaRef.current.value = ''

          if (onSubmit) onSubmit(payload, comment)

          // TODO: this is not working
          let link = document.getElementById('login-link')
          let username = res.body.data.attributes.full_name
          link.innerHTML =
            'You are viewing as guest, <b>' +
            username +
            '</b>, <a href="/upgrade">click to register</a>.'
          link.setAttribute('target', 'upgrade')
        }
      })
  }

  const onLoginClick = (e) => {
    let oldLocation = window.location.pathname
    window.location = '/login?redirect_to=' + oldLocation

    // TODO: make sure the comment posts after login
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

  let classes = thread ? 'j-commentLoginForm floater' : 'j-commentLoginForm'

  return (
    <div>
      {currentUser &&
        currentUser.currentUser &&
        currentUser.currentUser.attributes &&
        !currentUser.currentUser.attributes.id && (
          <form
            className={`${className} ${modifierClasses}`}
            onSubmit={handleSubmit}
          >
            {text && (
              <div className="mb-2" style={{ backgroundColor: '#B8E986' }}>
                {text}
              </div>
            )}
            <textarea
              data-autogrow
              className="j-commentForm__input"
              defaultValue=""
              placeholder="What's on your mind..."
              onKeyDown={handleKeyDown}
              ref={textareaRef}
              /* eslint-disable-next-line jsx-a11y/no-autofocus */
              autoFocus
              id="comment-form-input"
            ></textarea>

            <div
              className="pt-1 pb-2"
              style={{ fontSize: '.8rem', textAlign: 'right' }}
            >
              You are posting as a guest.
            </div>

            <div className="j-commentForm__actions pt-1 pb-3 d-flex flex-row-reverse">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onGuestClick}
              >
                Post as guest
              </button>{' '}
              <button
                type="button"
                className="btn btn-sm o"
                onClick={onLoginClick}
              >
                Log In
              </button>
            </div>
          </form>
        )}

      {currentUser &&
        currentUser.currentUser &&
        currentUser.currentUser.attributes &&
        currentUser.currentUser.attributes.id && (
          <form
            className={`${className} ${modifierClasses}`}
            onSubmit={handleSubmit}
          >
            {text && (
              <div
                className="mb-3"
                style={{ backgroundColor: '#B8E986', fontSize: '.8rem' }}
              >
                {text}
              </div>
            )}
            <textarea
              data-autogrow
              className="j-commentForm__input"
              defaultValue=""
              placeholder="What's on your mind..."
              onKeyDown={handleKeyDown}
              ref={textareaRef}
              /* eslint-disable-next-line jsx-a11y/no-autofocus */
              autoFocus
              id="comment-form-input"
            ></textarea>
            <div className="j-commentForm__actions pt-1 pb-2 d-flex flex-row-reverse">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSubmit}
              >
                Comment
              </button>{' '}
              <button
                type="button"
                className="btn btn-sm o"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
    </div>
  )
}
