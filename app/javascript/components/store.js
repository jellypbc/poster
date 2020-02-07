import { configureStore, createReducer } from '@reduxjs/toolkit'

// unsafe side-effects for comment actions
const commentsEffects = {
  onCommentAdd: payload => null,
  onCommentStart: () => {
    const commentFormInput = document.querySelector('#comment-form-input')
    if (commentFormInput) commentFormInput.focus()
  },
}

const commentsReducerDefaultState = {
  isAddingComment: false,
}

const commentReducers = {
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
    commentsEffects.onCommentAdd = payload => null
  },
  addCommentSave: (state, action) => {
    state.isAddingComment = false
    if (commentsEffects.onCommentAdd) {
      commentsEffects.onCommentAdd(action.payload)
    }
  },
}


// ======== images

const imagesEffects = {
  onImageAddSuccess: (payload) => {
    console.log("wahoo i got the payload:", payload)
    console.log("now i will post to posts controller")

    // const fireAway = (post_id, file_id) => {
    //   const url = '/posts/add_figure'
    //   const data = {
    //     post_id: post_id,
    //     file_id: file_id
    //   }
    //   superagent.post(url)
    //     .send(data)
    //     .set('X-CSRF-Token', token)
    //     .set('accept', 'application/json')
    //     .then(res => {
    //       console.log(res)
    //       window.location = res.body.redirect_to
    //     })
    //     .catch(err => {
    //       console.log(err.message)
    //       // this.setState({error: err.message})
    //     })
    // }

  }
}

const imagesReducerDefaultState = {
  isAddingimage: false,
}

const imageReducers = {
  addImageStart: (state, action) => {
    state.isAddingImage = true
  },
  addImageSave: (state, action) => {
    imagesEffects.onImageAddSuccess(action.payload)
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
