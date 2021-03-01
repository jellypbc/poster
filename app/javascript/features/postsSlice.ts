import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPost } from '../components/types'

const posts = createSlice({
  name: 'post',
  initialState: {},
  reducers: {
    setCurrentPost: (state: any, { payload } : PayloadAction<IPost>) => {
      state.currentPost = payload.data
    },
  }
})

export const { setCurrentPost } = posts.actions

export default posts.reducer
