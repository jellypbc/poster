import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICurrentUser } from '../components/types'

const user = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setCurrentUser: (state: any, { payload } : PayloadAction<ICurrentUser>) => {
      state.currentUser = payload.data
    },
  }
})

export const { setCurrentUser } = user.actions

export default user.reducer