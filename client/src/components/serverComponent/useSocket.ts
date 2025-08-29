import { useEffect } from "react"
import socketIOClient, { Socket } from "socket.io-client"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setConnected, selectConnected } from "./socketSlice"
import type { DriverState, Drivers, Driver } from "../drivers/driversSlice"

interface ClientToServerEvents {
  updateDrivers: (drivers: Drivers) => void
  askForStateUpdate: () => void
  addNewDriver: (driver: Driver) => void
}

interface ServerToClientEvents {
  updateState: (state: DriverState) => void
}

export const useSocket = ({ endpoint }: { endpoint: string }) => {
  const dispatch = useAppDispatch()
  const connected = useAppSelector(selectConnected)
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    socketIOClient(endpoint)

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to server")
      dispatch(setConnected(true))
    }

    const onDisconnect = () => {
      dispatch(setConnected(false))
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("connect_error", () => {
      console.log("Error connecting to server")
      onDisconnect()
    })

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  return {
    connected,
    socket,
  }
}
