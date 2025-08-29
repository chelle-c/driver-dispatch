import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

export type Driver = {
  id: number
  name: string
  location: [number, number]
  deliveryStatus: string
}

export type Drivers = Driver[]

export type DriverState = { drivers: Drivers; filteredDrivers: Drivers }

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
}

export const driversSlice = createAppSlice({
  name: "drivers",
  initialState,
  reducers: create => ({
    addDriver: create.reducer((state, action: PayloadAction<Driver>) => {
      state.drivers.push(action.payload)
    }),
    setDrivers: create.reducer((state, action: PayloadAction<Drivers>) => {
      console.log("Drivers received from server")
      state.drivers = action.payload
    }),
    updateDriver: create.reducer((state, action: PayloadAction<Driver>) => {
      const driverIndex = state.drivers.findIndex(
        driver => driver.id === action.payload.id,
      )
      state.drivers[driverIndex] = action.payload
    }),
    setFilteredDrivers: create.reducer(
      (state, action: PayloadAction<Drivers>) => {
        state.filteredDrivers = action.payload
      },
    ),
  }),
  selectors: {
    selectDrivers: driverState => driverState.drivers,
    selectFilteredDrivers: driverState => driverState.filteredDrivers,
  },
})

export const { addDriver, setDrivers, updateDriver, setFilteredDrivers } =
  driversSlice.actions

export const { selectDrivers, selectFilteredDrivers } = driversSlice.selectors
