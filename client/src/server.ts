import { WebSocketServer } from "ws"
const wss = new WebSocketServer({ port: 8080 })

let driverLocation = "New York"
let deliveryStatus = "In Transit"

wss.on("connection", ws => {
  console.log("Client connected")

  // Handle incoming messages from clients
  ws.on("message", message => {
    console.log(`Received message: ${message}`)
    const data = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message
    if (data.type === "REQUEST_DRIVER_LOCATION") {
      // Send updated driver location to client
      ws.send(
        JSON.stringify({
          type: "UPDATE_DRIVER_LOCATION",
          payload: driverLocation,
        }),
      )
    } else if (data.type === "REQUEST_DELIVERY_STATUS") {
      // Send updated delivery status to client
      ws.send(
        JSON.stringify({
          type: "UPDATE_DELIVERY_STATUS",
          payload: deliveryStatus,
        }),
      )
    } else if (data.type === "UPDATE_DRIVER_LOCATION") {
      // Update driver location
      driverLocation = data.payload
      // Broadcast updated driver location to all connected clients
      wss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "UPDATE_DRIVER_LOCATION",
            payload: driverLocation,
          }),
        )
      })
    } else if (data.type === "UPDATE_DELIVERY_STATUS") {
      // Update delivery status
      deliveryStatus = data.payload
      // Broadcast updated delivery status to all connected clients
      wss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: "UPDATE_DELIVERY_STATUS",
            payload: deliveryStatus,
          }),
        )
      })
    }
  })

  // Handle disconnections
  ws.on("close", () => {
    console.log("Client disconnected")
  })
})
