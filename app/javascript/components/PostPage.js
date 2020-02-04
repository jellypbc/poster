import React from 'react'
import { configureStore, createReducer } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import PostEditor from './PostEditor'
import CommentForm from './CommentForm'

const commentsReducerDefaultState = {
  isAddingComment: false,
  activeComment: {
    text: '',
  },
}

const commentReducers = {
  addCommentStart: (state, action) => {
    state.isAddingComment = true
  },
  addCommentStop: (state, action) => {
    state.isAddingComment = false
  },
  addCommentCancel: (state, action) => {
    state.isAddingComment = false
    state.activeComment.text = ''
  },
  addCommentSave: (state, action) => {
    // this is the same result as cancel but there should be a side-effect to save it
    console.log(state.activeComment)
    state.isAddingComment = false
    state.activeComment.text = ''
  },
}

const store = configureStore({
  reducer: {
    comments: createReducer(commentsReducerDefaultState, commentReducers),
  },
})

// for debugging
window._store = store

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

export { store }

export default PostPage
