import cors from "cors";
import express from "express";
import { Server } from "socket.io";

type Driver = {
	id: number;
	name: string;
	location: [number, number];
	deliveryStatus: string;
};

type Drivers = Driver[];

type DriverState = {
	drivers: Drivers;
	filteredDrivers: Drivers;
}

interface ClientToServerEvents {
	updateDrivers: (drivers: Drivers) => void;
	askForStateUpdate: () => void;
	addNewDriver: (driver: Driver) => void;
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
};

io.on("connection", (socket) => {
	console.log("client connected");

	// the client will send an 'askForStateUpdate' request on mount
	// to get the initial state of the poll
	socket.on("askForStateUpdate", () => {
		console.log("client asked For State Update");
		socket.emit("updateState", driverState);
	});

	socket.on("updateDrivers", (drivers: Drivers) => {
		console.log("Updating drivers...", drivers);
		driverState.drivers = drivers;
		io.emit("updateState", driverState);
		console.log("Drivers updated.", driverState);
	});

	socket.on("addNewDriver", (driver: Driver) => {
		console.log("Adding new driver...", driver);
		driverState.drivers.push(driver);
		io.emit("updateState", driverState);
		console.log("Driver added.");
	});

	socket.on("disconnect", () => {
		console.log("client disconnected");
	});
});

server.listen(8000, () => {
	console.log("listening on *:8000");
});
