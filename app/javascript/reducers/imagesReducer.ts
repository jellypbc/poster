import { createSlice } from '@reduxjs/toolkit'

export const images = createSlice({
  name: 'images',
  initialState: {
    isAddingimage: false,
    lastImage: null,
  },
  reducers: {
    addImageStart: (state: any, action) => {
      state.lastImage = null
      state.isAddingImage = true
    },
    addImageSuccess: (state: any, action) => {
      state.lastImage = action.payload
      state.isAddingImage = false
    },
    closeImageModal: (state: any, action) => {
      state.isAddingImage = false
    },
  },
})
