import { useEffect } from "react"
import useWebSocket from "react-use-websocket"

const WebSocketComponent = () => {
  const { sendJsonMessage, lastMessage } = useWebSocket("ws://localhost:8080")

  // Send request for driver location
  const handleRequestDriverLocation = () => {
    sendJsonMessage({ type: "REQUEST_DRIVER_LOCATION" })
  }

  // Send request for delivery status
  const handleRequestDeliveryStatus = () => {
    sendJsonMessage({ type: "REQUEST_DELIVERY_STATUS" })
  }

  // Update driver location
  const handleUpdateDriverLocation = () => {
    sendJsonMessage({ type: "UPDATE_DRIVER_LOCATION", payload: "Los Angeles" })
  }

  // Update delivery status
  const handleUpdateDeliveryStatus = () => {
    sendJsonMessage({ type: "UPDATE_DELIVERY_STATUS", payload: "Delivered" })
  }

  // Handle incoming messages from server
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data)
      if (data.type === "UPDATE_DRIVER_LOCATION") {
        console.log(`Driver location updated: ${data.payload}`)
      } else if (data.type === "UPDATE_DELIVERY_STATUS") {
        console.log(`Delivery status updated: ${data.payload}`)
      }
    }
  }, [lastMessage])

  return (
    <div>
      <button onClick={handleRequestDriverLocation}>
        Request Driver Location
      </button>
      <button onClick={handleRequestDeliveryStatus}>
        Request Delivery Status
      </button>
      <button onClick={handleUpdateDriverLocation}>
        Update Driver Location
      </button>
      <button onClick={handleUpdateDeliveryStatus}>
        Update Delivery Status
      </button>
    </div>
  )
}

export default WebSocketComponent
