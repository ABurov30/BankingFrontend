import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

export type ToastVariant = 'error' | 'success'

export type Toast = {
  id: string
  message: string
  title: string
  variant: ToastVariant
}

type ToastState = {
  items: Toast[]
}

type ShowToastPayload = {
  message: string
  title?: string
  variant?: ToastVariant
}

const initialState: ToastState = {
  items: [],
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    dismissToast(state, action: PayloadAction<string>) {
      state.items = state.items.filter((toast) => toast.id !== action.payload)
    },
    showToast: {
      prepare(payload: ShowToastPayload) {
        return {
          payload: {
            id: nanoid(),
            title:
              payload.title ??
              (payload.variant === 'success' ? 'Success' : 'Request failed'),
            variant: payload.variant ?? 'error',
            message: payload.message,
          },
        }
      },
      reducer(state, action: PayloadAction<Toast>) {
        state.items = [action.payload, ...state.items].slice(0, 4)
      },
    },
  },
})

export const { dismissToast, showToast } = toastSlice.actions
export default toastSlice.reducer
