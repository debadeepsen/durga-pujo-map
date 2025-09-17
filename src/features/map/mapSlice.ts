import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Feature, Point } from 'geojson'

interface MapState {
  center: [number, number]
  zoom: number
  selectedPandal: Feature<Point> | null
  viewport: {
    latitude: number
    longitude: number
    zoom: number
  }
}

const initialState: MapState = {
  center: [22.5386, 88.3462],
  zoom: 12.65,
  selectedPandal: null,
  viewport: {
    latitude: 22.5386,
    longitude: 88.3462,
    zoom: 12.65,
  },
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setViewport: (state, action: PayloadAction<MapState['viewport']>) => {
      state.viewport = action.payload
      state.center = [action.payload.latitude, action.payload.longitude]
      state.zoom = action.payload.zoom
    },
    selectPandal: (state, action: PayloadAction<Feature<Point> | null>) => {
      state.selectedPandal = action.payload
      if (action.payload) {
        const [lng, lat] = action.payload.geometry.coordinates
        state.viewport = {
          ...state.viewport,
          latitude: lat,
          longitude: lng,
        }
      }
    },
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload
      state.viewport = {
        ...state.viewport,
        latitude: action.payload[0],
        longitude: action.payload[1],
      }
    },
  },
})

export const { setViewport, selectPandal, setCenter } = mapSlice.actions
export default mapSlice.reducer
