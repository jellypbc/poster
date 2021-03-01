import { createSlice } from '@reduxjs/toolkit'

interface ImagesState {
  isAddingImage: boolean;
  lastImage: {
    fileUrl: string
  };
}

const initialState: ImagesState = {
  isAddingImage: false,
  lastImage: null,
}

const images = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImageStart: (state: any) => {
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

export const { addImageStart, addImageSuccess, closeImageModal } = images.actions

export const imagesSelector = (state: { images: ImagesState }) => state.images

export default images.reducer