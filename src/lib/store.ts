import { configureStore } from '@reduxjs/toolkit'
import mapReducer from '@/features/map/mapSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      map: mapReducer,
    },
    // Add any middleware or other store configuration here
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
