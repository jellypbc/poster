import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import PostEditor from './PostEditor'
import CommentForm from './CommentForm'

// This is where Redux is set up, it has to be a parent component for anything that wants to
// reference the reducer state in the editor.
// Anything can dispatch to the reducer by importing `dispatch` from react-redux
// and the component will rerender any subscribers on change.
function PostPage(props) {
  return (
    <Provider store={store}>
      <PostEditor {...props} />
      <CommentForm />
    </Provider>
  )
}

export default PostPage
