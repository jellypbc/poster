import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// unsafe side-effects for comment actions
const commentsEffects = {
  onCommentSuccess: (payload) => null,
  onCommentAdd: (payload) => null,
  onCommentStart: () => {
    const commentFormInput = document.querySelector('#comment-form-input')
    if (commentFormInput) commentFormInput.focus()
  },
}

const commentsReducerDefaultState = {
  isAddingComment: false,
  comments: [],
}

const comments = createSlice({
  name: 'comments',
  initialState: commentsReducerDefaultState,
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload.comments
      // will set the posts comments from new data or componentDidMount?
    },

    addCommentStart: (state, action) => {
      state.isAddingComment = true
      if (commentsEffects.onCommentStart) {
        commentsEffects.onCommentStart()
      }
      if (action.payload.onCommentAdd) {
        commentsEffects.onCommentAdd = action.payload.onCommentAdd
      }
    },
    addCommentCancel: (state, action) => {
      state.isAddingComment = false
      commentsEffects.onCommentAdd = (payload) => null
    },
    addCommentSave: (state, action) => {
      state.isAddingComment = false
      if (commentsEffects.onCommentAdd) {
        commentsEffects.onCommentAdd(action.payload)
      }
      if (commentsEffects.onCommentSuccess) {
        commentsEffects.onCommentSuccess(action.payload)
      }
      state.newestComment = action.payload
    },
  }
})

export default comments.reducer

export const {
  setComments,
  addCommentStart,
  addCommentCancel,
  addCommentSave
} = comments.actions
