import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import data from "./driverData.json";

type Driver = {
	id: number;
	name: string;
	location: number[];
	deliveryStatus: string;
};

type Drivers = Driver[];

type DriverState = {
	drivers: Drivers;
	filteredDrivers: Drivers;
};

interface ClientToServerEvents {
	updateDriver: (driver: Driver) => void;
	updateDrivers: (drivers: Drivers) => void;
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

	socket.on("updateDrivers", (drivers: Drivers) => {
		console.log("Updating drivers...", drivers);
		driverState.drivers = drivers;
		setTimeout(() => {
			socket.emit("updateState", driverState);
		}, 2000);
		console.log("Drivers updated.", driverState);
	});

	socket.on("updateDriver", (receivedDriver: Driver) => {
		console.log("Updating driver...");
		const driverIndex = driverState.drivers.findIndex((driver) => driver.id === receivedDriver.id);
		driverState.drivers[driverIndex] = receivedDriver;
		setTimeout(() => {
			socket.emit("updateState", driverState);
		}, 2000);
		console.log("Driver updated.", driverState.drivers[driverIndex]);
	})

	socket.on("disconnect", () => {
		console.log("client disconnected");
	});
});

server.listen(8000, () => {
	console.log("listening on *:8000");
});
