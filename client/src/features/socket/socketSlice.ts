import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Drivers, SocketState } from "../../types/types"

// Define the initial state
const initialState: SocketState = {
  isConnected: false,
}

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    // Actions to open and close the socket connection
    connectionStart: _state => {},
    connectionClose: _state => {},

    // Reducers to actually update the state
    connectionEstablished: state => {
      state.isConnected = true
    },
    connectionClosed: state => {
      state.isConnected = false
    },
    // Action to update the list of drivers
    dataReceived: (_state, _action: PayloadAction<Drivers>) => {},
  },
})

export const {
  connectionStart,
  connectionClose,
  connectionEstablished,
  connectionClosed,
  dataReceived,
} = socketSlice.actions
export default socketSlice
