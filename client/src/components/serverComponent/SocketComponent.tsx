import { useEffect } from "react"
import { useAppDispatch } from "../../app/hooks"
import { DriverState, setDrivers } from "../drivers/driversSlice"
import { useSocket } from "./useSocket"

const SocketComponent = () => {
  // set the PollState after receiving it from the server
  const dispatch = useAppDispatch()

  // 🔌⚡️ get the connected socket client from our useSocket hook!
  const { socket } = useSocket({
    endpoint: `http://localhost:8000`,
    options: {},
  })

  socket.on("updateState", (newState: DriverState) => {
    dispatch(setDrivers(newState.drivers))
  })

  useEffect(() => {
    socket.emit("askForStateUpdate")
  }, [])

  return <></>
}

export default SocketComponent
