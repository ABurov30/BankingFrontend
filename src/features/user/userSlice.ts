import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { GetUserInfoResponse } from '@/shared/api/types'

type UserState = {
  currentUser: GetUserInfoResponse | null
}

const initialState: UserState = {
  currentUser: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearCurrentUser(state) {
      state.currentUser = null
    },
    setCurrentUser(state, action: PayloadAction<GetUserInfoResponse>) {
      state.currentUser = action.payload
    },
  },
})

export const { clearCurrentUser, setCurrentUser } = userSlice.actions
export const selectCurrentUser = (state: RootState) => state.user.currentUser
export default userSlice.reducer
