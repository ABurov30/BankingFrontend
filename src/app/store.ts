import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import accountsReducer from '../features/accounts/accountsSlice'
import appReducer from '../features/app/appSlice'
import cardsReducer from '../features/cards/cardsSlice'
import counterReducer from '../features/counter/counterSlice'
import rightPanelReducer from '../features/rightPanel/rightPanelSlice'
import toastReducer from '../features/toast/toastSlice'
import userReducer from '../features/user/userSlice'
import { baseApi } from '../shared/api/baseApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    accounts: accountsReducer,
    app: appReducer,
    cards: cardsReducer,
    counter: counterReducer,
    rightPanel: rightPanelReducer,
    toast: toastReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
