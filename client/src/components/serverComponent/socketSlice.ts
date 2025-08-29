import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

export const socketSlice = createAppSlice({
	name: "socket",
	initialState: {
		connected: false,
	},
	reducers: create => ({
		setConnected: create.reducer((state, action: PayloadAction<boolean>) => {
			state.connected = action.payload
		}),
	}),
	selectors: {
		selectConnected: socket => socket.connected
	}
})

export const { setConnected: setConnected } = socketSlice.actions

export const { selectConnected } = socketSlice.selectors