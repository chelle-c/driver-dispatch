import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAppDispatch } from "../../app/hooks"
import { Driver, DriverState, setDrivers } from "../drivers/driversSlice"
import { useSocket } from "./useSocket"

const SocketComponent = () => {
  // set the PollState after receiving it from the server
  const dispatch = useAppDispatch()

  // 🔌⚡️ get the connected socket client from our useSocket hook!
  const { socket, connected } = useSocket({
    endpoint: `http://localhost:8000`,
  })

  socket.on("updateState", (newState: DriverState) => {
    dispatch(setDrivers(newState.drivers))
  })

  useEffect(() => {
    socket.emit("askForStateUpdate")
  }, [])

  const addNewDriver = () => {
    const newDriver: Driver = {
      id: 5,
      name: "New Driver",
      location: [0, 0],
      deliveryStatus: "Idle",
    }
    socket.emit("addNewDriver", newDriver)
  }

  if (!connected) {
    return <div>Not connected</div>
  }

  return (
    <div>
      <div>
        <button onClick={addNewDriver}>Add new driver</button>
      </div>
    </div>
  )
}

export default SocketComponent
