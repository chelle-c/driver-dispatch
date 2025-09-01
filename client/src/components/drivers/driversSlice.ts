import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import { socketActions } from "../../utils/socketSlice"
import type { Driver, Drivers } from "../../types/types"

export type DriverState = {
  drivers: Drivers
  filteredDrivers: Drivers
  filteredState: string
  currentDriver: Driver | null
}

const initialState: DriverState = {
  drivers: [
    {
      id: 1,
      name: "Example Driver",
      location: [0, 0],
      deliveryStatus: "Paused",
    },
  ],
  filteredDrivers: [],
  filteredState: "All",
  currentDriver: null,
}

export const driversSlice = createAppSlice({
  name: "drivers",
  initialState,
  reducers: create => ({
    setDrivers: create.reducer((state, action: PayloadAction<Drivers>) => {
      console.log("Drivers received from server")
      state.drivers = action.payload
    }),
    setFilteredDrivers: create.reducer(
      (state, action: PayloadAction<Drivers>) => {
        state.filteredDrivers = action.payload
      },
    ),
    setFilteredState: create.reducer((state, action: PayloadAction<string>) => {
      state.filteredState = action.payload
    }),
    setCurrentDriver: create.reducer(
      (state, action: PayloadAction<Driver | null>) => {
        state.currentDriver = action.payload
      },
    ),
    updateDriver: create.reducer((state, action: PayloadAction<Driver>) => {
      // const driverIndex = state.drivers.findIndex(
      //   driver => driver.id === action.payload.id,
      // )
    }),
    updateServerDrivers: create.reducer(
      (state, action: PayloadAction<Drivers>) => {},
    ),
  }),
  selectors: {
    selectDrivers: driverState => driverState.drivers,
    selectFilteredDrivers: driverState => driverState.filteredDrivers,
    selectFilteredState: driverState => driverState.filteredState,
    selectCurrentDriver: driverState => driverState.currentDriver,
  },
  extraReducers: builder => {
    builder.addCase(
      socketActions.dataReceived,
      (state, action: PayloadAction<Drivers>) => {
        state.drivers = action.payload
      },
    )
  },
})

export const {
  setDrivers,
  updateDriver,
  setFilteredDrivers,
  setFilteredState,
  setCurrentDriver,
  updateServerDrivers
} = driversSlice.actions

export const {
  selectDrivers,
  selectFilteredDrivers,
  selectFilteredState,
  selectCurrentDriver,
} = driversSlice.selectors
