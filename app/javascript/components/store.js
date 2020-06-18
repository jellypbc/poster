import { configureStore, createReducer } from '@reduxjs/toolkit'

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

const commentReducers = {
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

const imagesEffects = {
  onImageAddSuccess: (payload) => {},
}

const imagesReducerDefaultState = {
  isAddingimage: false,
}

const imageReducers = {
  addImageStart: (state, action) => {
    state.isAddingImage = true
    // runs the images plugin onImageAddSuccess() payload
    if (action.payload.onImageAddSuccess) {
      imagesEffects.onImageAddSuccess = action.payload.onImageAddSuccess
    }
  },
  addImageSuccess: (state, action) => {
    if (imagesEffects.onImageAddSuccess) {
      imagesEffects.onImageAddSuccess(action)
    }
    state.isAddingImage = false
  },
  closeImageModal: (state, action) => {
    state.isAddingImage = false
  },
}

const postReducers = {
  setCurrentPost: (state, action) => {
    state.currentPost = action.payload.data
  },
}

const userReducers = {
  setCurrentUser: (state, action) => {
    console.log("receiving action", action)
    state.currentUser = action.payload.data
  },
}

const store = configureStore({
  reducer: {
    comments: createReducer(commentsReducerDefaultState, commentReducers),
    images: createReducer(imagesReducerDefaultState, imageReducers),
    currentPost: createReducer({}, postReducers),
    currentUser: createReducer({}, userReducers),
  },
})

// for debugging
window._store = store

export { store }
