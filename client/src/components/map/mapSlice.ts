import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

type MapState = {
	center: [number, number];
	marker: [number, number];
};

const initialState: MapState = {
  center: [40.7128, -74.006],
  marker: [40.7128, -74.006],
}

export const mapSlice = createAppSlice({
	name: "map",
	initialState,
	reducers: create => ({
		setCenter: create.reducer((state, action: PayloadAction<[number, number]>) => {
			state.center = action.payload;
		}),
		setMarker: create.reducer((state, action: PayloadAction<[number, number]>) => {
			state.marker = action.payload
		})
	}),
	selectors: {
		selectCenter: map => map.center,
	},
});

export const { setCenter, setMarker } = mapSlice.actions;

export const { selectCenter } = mapSlice.selectors;