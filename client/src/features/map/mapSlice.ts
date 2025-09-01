import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

type MapState = {
	center: [number, number];
};

// Define the initial state
const initialState: MapState = {
  center: [40.7128, -74.006],
}

export const mapSlice = createAppSlice({
	name: "map",
	initialState,
	reducers: create => ({
		// Set the center of the map
		setCenter: create.reducer((state, action: PayloadAction<[number, number]>) => {
			state.center = action.payload;
		}),
	}),
	selectors: {
		selectCenter: map => map.center,
	},
});

export const { setCenter } = mapSlice.actions;

export const { selectCenter } = mapSlice.selectors;