// src/app/socketMiddleware.ts (Updated)

import { Middleware } from "@reduxjs/toolkit"
import { io, Socket } from "socket.io-client"
import { useAppDispatch } from "./hooks"
import { socketActions } from "../utils/socketSlice"
import { updateDriver, updateServerDrivers } from "../components/drivers/driversSlice"
import type { Drivers, DriverState } from "../types/types"
import { notifications } from "@mantine/notifications"

const socketMiddleware: Middleware = store => {
  let socket: Socket | null = null

  return next => (action: any) => {
    const { dispatch } = store
    const {
      connectionStart,
      connectionClose,
      connectionEstablished,
      connectionClosed,
      dataReceived,
    } = socketActions

    // Check for connection actions
    if (action.type === connectionStart.type && !socket) {
      socket = io("http://localhost:8000")

      socket.on("connect", () => {
        notifications.show({
          title: "Connected to Server",
          message: "You are now connected to the server.",
        })
        dispatch(connectionEstablished())
      })

      socket.on("updateState", (state: DriverState) => {
        notifications.show({
          title: "Drivers Updated",
          message: "The drivers have been updated.",
        })
        dispatch(dataReceived(state.drivers))
      })

      socket.on("disconnect", () => {
        notifications.show({
          title: "Disconnected from Server",
          message: "You have been disconnected from the server.",
        })
        dispatch(connectionClosed())
      })
    }

    // Check for closing connection
    if (action.type === connectionClose.type && socket) {
      socket.disconnect()
    }

    if (action.type === updateServerDrivers.type && socket) {
      socket.emit("updateDrivers", action.payload)
    }

    if (action.type === updateDriver.type && socket) {
      socket.emit("updateDriver", action.payload)
    }

    return next(action)
  }
}

export default socketMiddleware
