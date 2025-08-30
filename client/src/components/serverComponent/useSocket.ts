import { useEffect } from "react"
import socketIOClient, { Socket } from "socket.io-client"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setConnected, selectConnected } from "./socketSlice"
import type { DriverState, Drivers, Driver } from "../drivers/driversSlice"
import { notifications } from "@mantine/notifications"

interface ClientToServerEvents {
  updateDrivers: (drivers: Drivers) => void
  askForStateUpdate: () => void
  addNewDriver: (driver: Driver) => void
}

interface ServerToClientEvents {
  updateState: (state: DriverState) => void
}

export const useSocket = ({
  endpoint,
  options,
}: {
  endpoint: string
  options?: Object
}) => {
  const dispatch = useAppDispatch()
  const connected = useAppSelector(selectConnected)
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    socketIOClient(endpoint, options)

  useEffect(() => {
    const onConnect = () => {
      notifications.show({
        title: "Connected to server",
        message: "Successfully connected to the server.",
        color: "green",
      })
      dispatch(setConnected(true))
    }

    const onDisconnect = () => {
      dispatch(setConnected(false))
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("connect_error", () => {
      notifications.show({
        title: "Connection error",
        message: "Failed to connect to the server.",
        color: "red",
      })
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
