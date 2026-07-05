import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type RightPanelContent = 'transfer'

type RightPanelState = {
  content: RightPanelContent | null
}

const initialState: RightPanelState = {
  content: null,
}

export const rightPanelSlice = createSlice({
  name: 'rightPanel',
  initialState,
  reducers: {
    closeRightPanel: (state) => {
      state.content = null
    },
    openRightPanel: (state, action: PayloadAction<RightPanelContent>) => {
      state.content = action.payload
    },
  },
})

export const { closeRightPanel, openRightPanel } = rightPanelSlice.actions

export default rightPanelSlice.reducer
