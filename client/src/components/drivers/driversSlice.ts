import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

export type Driver = {
  id: number
  name: string
  location: [number, number]
  deliveryStatus: string
}

export type Drivers = Driver[]

type DriversState = { drivers: Drivers; filteredDrivers: Drivers }

const initialState: DriversState = {
  drivers: [
    {
      id: 1,
      name: "John Doe",
      location: [40.7128, -74.006],
      deliveryStatus: "Delivering",
    },
    {
      id: 2,
      name: "Jane Doe",
      location: [30.7128, -84.006],
      deliveryStatus: "Idle",
    },
    {
      id: 3,
      name: "Bob Smith",
      location: [50.7128, -94.006],
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
    selectDrivers: drivers => drivers.drivers,
    selectFilteredDrivers: drivers => drivers.filteredDrivers,
  },
})

export const {
  addDriver,
  setDrivers,
  updateDriver,
  setFilteredDrivers,
} = driversSlice.actions

export const { selectDrivers, selectFilteredDrivers } = driversSlice.selectors
