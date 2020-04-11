import { configureStore, createReducer } from '@reduxjs/toolkit'
import superagent from 'superagent'

// unsafe side-effects for comment actions
const commentsEffects = {
  onCommentSuccess: payload => {
    var url = '/comments'
    var method = 'post'
    // var url = isNewPost ? '/posts' : post.data.attributes.form_url
    // var method = isNewPost ? 'post' : 'put'
    // var token = document.head.querySelector('[name~=csrf-token][content]')
    //   .content

    var data = {
      comment: {
        data_to: payload.to,
        data_from: payload.from,
        data_key: payload.comment.id,
        comment: payload.comment,
        post_id: payload.post_id,
        // user_id: payload.user_id,
      }
    }

    superagent[method](url)
      .send(data)
      // .set('X-CSRF-Token', token)
      .set('accept', 'application/json')
      .end((err, res) => {
        console.log({ res, err }) // DEBUG SAVE

        // res is just showing a redirect instead of full data,
        // use the browser timestamp instead of new updated_at
        // const now = new Date().toISOString()
        // this.setState(state => ({
        //   isLoading: false,
        //   error: err ? err : null,
        //   errorAt: err ? now : null,
        //   lastSavedAt: err ? state.lastSavedAt : now,
        // }))
      })

    // store.dispatch({
    //   type: "setComments",
    //   payload: {
    //     comments: newComments
    //   }
    // })
  },
  onCommentAdd: payload => null,
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

const store = configureStore({
  reducer: {
    comments: createReducer(commentsReducerDefaultState, commentReducers),
    images: createReducer(imagesReducerDefaultState, imageReducers),
  },
})

// for debugging
window._store = store

export { store }
