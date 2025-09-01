import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import data from "./driverData.json";

type Driver = {
	id: number;
	name: string;
	avatar: string;
	latitude: number;
	longitude: number;
	status: string;
};

type Drivers = Driver[];

type DriverState = {
	drivers: Drivers;
	filteredDrivers: Drivers;
};

interface ClientToServerEvents {
	updateDriver: (
		driver: Driver,
		callback: (response: { success: boolean; error?: string }) => void
	) => void;
	askForStateUpdate: () => void;
}

interface ServerToClientEvents {
	updateState: (state: DriverState) => void;
}

interface InterServerEvents {}
interface SocketData {
	user: string;
}

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // this is the default port that Vite runs your React app on
const server = require("http").createServer(app);
// passing these generic type parameters to the `Server` class
// ensures data flowing through the server are correctly typed.
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
	server,
	{
		cors: {
			origin: "http://localhost:5173",
			methods: ["GET", "POST"],
		},
	}
);

// State of drivers passed to the client
const driverState: DriverState = {
	drivers: data,
	filteredDrivers: [],
};

io.on("connection", (socket) => {
	console.log("client connected");

	socket.emit("updateState", driverState);

	socket.on("askForStateUpdate", () => {
		socket.emit("updateState", driverState);
	});

	socket.on("updateDriver", async (receivedDriver: Driver, callback) => {
		try {
			const driverIndex = driverState.drivers.findIndex(
				(driver) => driver.id === receivedDriver.id
			);
			driverState.drivers[driverIndex] = receivedDriver;

			// Acknowledge the update
			callback({ success: true });

			// Broadcast the change to the client
			socket.broadcast.emit("updateState", driverState);

			// Log the updated driver
			console.log(`Driver ${receivedDriver.name} updated with delivery status: ${receivedDriver.status}.`);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error(`Error updating driver ${receivedDriver.name}:`, error);

				callback({
					success: false,
					error:
						error.message || `Error updating driver ${receivedDriver.name} on server.`,
				});
			} else {
				console.error(`Unknown error updating driver ${receivedDriver.name}:`, error);

				callback({
					success: false,
					error: `Unknown error occurred.`,
				});
			}
		}
	});

	socket.on("disconnect", () => {
		console.log("client disconnected");
	});
});

server.listen(8000, () => {
	console.log("listening on *:8000");
});
