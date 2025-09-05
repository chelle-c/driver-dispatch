import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import { dataReceived } from "../socket/socketSlice"
import type { Driver, Drivers } from "../../types/types"

export type DriverState = {
  drivers: Drivers
  filteredDrivers: Drivers
  filteredState: string
  currentDriver: Driver | null
  driverToRollBack: Driver | null
}

// Define the initial state
const initialState: DriverState = {
  drivers: [
    {
      id: 1,
      name: "Example Driver",
      avatar: "",
      latitude: 0,
      longitude: 0,
      status: "Paused",
    },
  ],
  filteredDrivers: [],
  filteredState: "All",
  currentDriver: null,
  driverToRollBack: null,
}

export const driversSlice = createAppSlice({
  name: "drivers",
  initialState,
  reducers: create => ({
    // Set the list of drivers from the server
    setDrivers: create.reducer((state, action: PayloadAction<Drivers>) => {
      state.drivers = action.payload
    }),
    // Set the list of filtered drivers
    setFilteredDrivers: create.reducer(
      (state, action: PayloadAction<Drivers>) => {
        state.filteredDrivers = action.payload
      },
    ),
    // Set the filtered state
    setFilteredState: create.reducer((state, action: PayloadAction<string>) => {
      state.filteredState = action.payload
    }),
    // Set the currently selected driver
    setCurrentDriver: create.reducer(
      (state, action: PayloadAction<Driver | null>) => {
        state.currentDriver = action.payload
      },
    ),
    // Optimistic update
    updateDriverRequest: create.reducer(
      (state, action: PayloadAction<Driver>) => {
        const driverToUpdate = action.payload
        const driverIndex = state.drivers.findIndex(
          driver => driver.id === driverToUpdate.id,
        )
        if (driverIndex !== -1) {
          // Store the original user state before updating
          state.driverToRollBack = state.drivers[driverIndex]
          // Apply the new state immediately
          state.drivers[driverIndex] = driverToUpdate
        }
      },
    ),
    // Successful data update (cleanup optimistic update)
    updateDriverSuccess: create.reducer(state => {
      state.driverToRollBack = null
    }),
    // Failed data update (rollback to original state)
    updateDriverFailure: create.reducer(
      (state, action: PayloadAction<Driver>) => {
        // Payload is the original driver
        const originalDriver = action.payload
        const driverIndex = state.drivers.findIndex(
          driver => driver.id === originalDriver.id,
        )

        if (driverIndex !== -1) {
          // Revert the driver's state
          state.drivers[driverIndex] = originalDriver
        }
        // Clean up rollback state
        state.driverToRollBack = null
      },
    ),
  }),
  selectors: {
    selectDrivers: driverState => driverState.drivers,
    selectFilteredDrivers: driverState => driverState.filteredDrivers,
    selectFilteredState: driverState => driverState.filteredState,
    selectCurrentDriver: driverState => driverState.currentDriver,
    selectDriverToRollBack: driverState => driverState.driverToRollBack,
  },
  extraReducers: builder => {
    builder.addCase(dataReceived, (state, action: PayloadAction<Drivers>) => {
      state.drivers = action.payload
    })
  },
})

export const {
  setDrivers,
  setFilteredDrivers,
  setFilteredState,
  setCurrentDriver,
  updateDriverRequest,
  updateDriverSuccess,
  updateDriverFailure,
} = driversSlice.actions

export const {
  selectDrivers,
  selectFilteredDrivers,
  selectFilteredState,
  selectCurrentDriver,
  selectDriverToRollBack,
} = driversSlice.selectors
