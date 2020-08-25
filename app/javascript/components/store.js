import { configureStore, createReducer, createSlice } from '@reduxjs/toolkit'

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

const images = createSlice({
  name: 'images',
  initialState: {
    isAddingimage: false,
    lastImage: null,
  },
  reducers: {
    addImageStart: (state, action) => {
      state.lastImage = null
      state.isAddingImage = true
    },
    addImageSuccess: (state, action) => {
      state.lastImage = action.payload
      state.isAddingImage = false
    },
    closeImageModal: (state, action) => {
      state.isAddingImage = false
    },
  },
})

const postReducers = {
  setCurrentPost: (state, action) => {
    state.currentPost = action.payload.data
  },
}

const userReducers = {
  setCurrentUser: (state, action) => {
    state.currentUser = action.payload.data
  },
}

const store = configureStore({
  reducer: {
    comments: createReducer(commentsReducerDefaultState, commentReducers),
    currentPost: createReducer({}, postReducers),
    currentUser: createReducer({}, userReducers),
    images: images.reducer,
  },
})

// for debugging
window._store = store

/**
 * Function to create a store observer
 * @param {(State | SelectorResult) => any} onChange - function to call on state change
 * @param {{}} [options] - options object
 * @param {(State) => SelectorResult} [options.selector] - optional function to transform the store state
 * @returns {{ unsubscribe: () => void }} object with an unsubscribe method
 */
function observeStore(onChange, { selector = (state) => state } = {}) {
  let currentState
  function handleChange() {
    // Using a selector function lets us subscribe to changes in just a slice of
    // the store (defaults to the whole thing if no selector is provided):
    let nextState = selector(store.getState())
    if (nextState !== currentState) {
      currentState = nextState
      onChange(currentState)
    }
  }
  return { unsubscribe: store.subscribe(handleChange) }
}

// exported in case you need to check the reason the condition failed
const TIMEOUT_ERROR = 'condition_timed_out'

/**
 * @example await waitForStore({ selector: state => state.posts[0], timeout: 1000, succeed: newPost => newPost.isCreating === false})
 * @returns {Promise} - Promise that resolves when succeed option returns true, and rejects if it times out or fail option returns true
 * @param {{}} [options] - options object
 * @param {(SelectorResult) => boolean} [options.succeed] - take selector result and returns true if promise should resolve
 * @param {(SelectorResult) => boolean} [options.fail] - take selector result and returns true if promise should reject
 * @param {(State) => SelectorResult} [options.selector] - optional function to transform the store state
 * @param {number} [options.timeout] how long to wait before rejecting automatically
 */
function waitForStore({
  succeed = () => false,
  fail = () => false,
  timeout = 5000,
  selector = (state) => state,
} = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    let observerRef = { current: { unsubscribe: () => {} } }
    const timer = setTimeout(() => {
      observerRef.current.unsubscribe()
      rejectPromise(new Error(TIMEOUT_ERROR))
    }, timeout)
    const finish = () => {
      observerRef.current.unsubscribe()
      clearTimeout(timer)
    }
    const onChange = (state) => {
      if (succeed(state)) {
        finish()
        resolvePromise(state)
      } else if (fail(state)) {
        finish()
        rejectPromise(state)
      }
    }
    observerRef.current = observeStore(onChange, { selector })
  })
}

export { store, images, observeStore, waitForStore, TIMEOUT_ERROR }
