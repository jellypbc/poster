import { createSlice } from '@reduxjs/toolkit'

export const images = createSlice({
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
