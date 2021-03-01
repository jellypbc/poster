import { createSlice } from '@reduxjs/toolkit'

const citations = createSlice({
  name: 'citations',
  initialState: {
    isAddingCitation: false,
    citations: null,
  },
  reducers: {
    setCitations: (state: any, action) => {
      state.citations = action.payload
    },
    addCitationStart: (state: any, action) => {
      state.lastCitation = null
      state.isAddingCitation = true
    },
    addCitationSuccess: (state: any, action) => {
      state.lastCitation = action.payload
      state.isAddingCitation = false
    },
    closeCitationModal: (state: any, action) => {
      state.isAddingCitation = false
    },
  },
})

export const {
  setCitations,
  addCitationStart,
  addCitationSuccess,
  closeCitationModal
} = citations.actions

export default citations.reducer