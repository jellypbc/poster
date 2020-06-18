import React, { useState, useEffect } from 'react'
import { store } from './store'
import superagent from 'superagent'
import autogrow from '../utils/autogrow'

// import { useSelector, useDispatch } from 'react-redux'

function useForceUpdate() {
  const [value, setValue] = useState(0) // integer state
  return () => setValue((value) => ++value) // update the state to force render
}

function CommentForm({ onSubmit, onCancel, className, ...rest }) {
  // const dispatch = useDispatch()
  // const comments = useSelector(state => state.comments)
  const textareaRef = React.useRef()

  useEffect(() => {
    autogrow()
  }, [])

  const getSavePayload = () => {
    return { text: textareaRef.current.value }
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
    // dispatch({ type: 'addCommentSave', payload })

    // maybe this dispatch happens here instead? but cant get access to props
    // dispatch({
    //   type: 'addCommentSave',
    //   payload: {
    //     type: 'newComment',
    //     comment: payload,
    //     // from: sel.from,
    //     // to: sel.to,
    //     // key: comment.id,
    //   }
    // })

    textareaRef.current.value = '' // clear (could change this to controlled value too)
    if (onSubmit) onSubmit(payload)
  }

  const onGuestClick = (e) => {
    // send a request to create a user
    var data = { user: { guest: true } }
    var url = '/guestcreate'
    superagent
      .post(url)
      .send(data)
      .set('accept', 'application/json')
      .end((err, res) => {
        console.log({ res, err }) // DEBUG SAVE

        if (res.status === 200) {
          store.dispatch({ type: 'setCurrentUser', payload: res.body })
          forceUpdate()

          // TODO: swap out login link in nav for a "register" button
          var link = document.getElementById('login-link')
          link.innerHTML = 'Register'
          link.setAttribute('target', 'upgrade')
        }
      })
  }

  const onLoginClick = (e) => {
    // render login form
    // which fires off login & login action
    console.log('i was clicked login')
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

  var { currentUser } = store.getState()
  var styles = {
    bottom: '200px',
  }

  return (
    <div>
      {currentUser &&
        currentUser.currentUser &&
        currentUser.currentUser.attributes &&
        !currentUser.currentUser.attributes.id && (
          <div
            className="j-commentForm ph-3 border-top pt-1 mb-4"
            style={styles}
          >
            <p>Login or continue as guest</p>

            <button onClick={onLoginClick}>Login</button>
            <br />

            <button onClick={onGuestClick}>Continue as guest</button>
          </div>
        )}

      {currentUser &&
        currentUser.currentUser &&
        currentUser.currentUser.attributes &&
        currentUser.currentUser.attributes.id && (
          <form
            className={`${className} ${modifierClasses}`}
            {...rest}
            onSubmit={handleSubmit}
          >
            <textarea
              data-autogrow
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

export default CommentForm
