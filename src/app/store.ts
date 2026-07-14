import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import appReducer from '../features/app/appSlice'
import counterReducer from '../features/counter/counterSlice'
import rightPanelReducer from '../features/rightPanel/rightPanelSlice'
import toastReducer from '../features/toast/toastSlice'
import { baseApi } from '../shared/api/baseApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    app: appReducer,
    counter: counterReducer,
    rightPanel: rightPanelReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
