import { configureStore, createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import userReducer from './features/userSlice'
import postsReducer from './features/postsSlice'
import imagesReducer from './features/imagesSlice'
import citationsReducer from './features/citationsSlice'
import commentsReducers from './features/commentsSlice'

const rootReducer = combineReducers({
  currentPost: postsReducer,
  currentUser: userReducer,
  images: imagesReducer,
  comments: commentsReducers,
  citations: citationsReducer
})

const store = configureStore({
  reducer: rootReducer
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
const observeStore = (onChange, { selector = (state) => state } = {}) => {
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
const waitForStore = ({
  succeed = () => false,
  fail = () => false,
  timeout = 5000,
  selector = (state) => state,
} = {}) => {
  return new Promise((resolvePromise, rejectPromise) => {
    let observerRef = { current: { unsubscribe: () => undefined } }
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

export { store, observeStore, waitForStore, TIMEOUT_ERROR }
