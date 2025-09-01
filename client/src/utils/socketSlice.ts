import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Drivers } from "../types/types"

interface SocketState {
  isConnected: boolean
}

const initialState: SocketState = {
  isConnected: false,
}

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connectionStart: state => {},
    connectionClose: state => {},
    sendData: (state, action: PayloadAction<Drivers>) => {},

    // Reducers to actually update the state
    connectionEstablished: state => {
      state.isConnected = true
    },
    connectionClosed: state => {
      state.isConnected = false
    },
    dataReceived: (state, action: PayloadAction<Drivers>) => {
      // state.drivers = action.payload
    },
  },
})

export const socketActions = socketSlice.actions
export default socketSlice
