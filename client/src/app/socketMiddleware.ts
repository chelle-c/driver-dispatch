import { Middleware } from "@reduxjs/toolkit"
import { io, Socket } from "socket.io-client"
import { socketActions } from "../features/socket/socketSlice"
import {
  updateDriverRequest,
  updateDriverSuccess,
  updateDriverFailure,
} from "../features/drivers/driversSlice"
import type { DriverState } from "../types/types"
import { notifications } from "@mantine/notifications"

const socketMiddleware: Middleware = store => {
  let socket: Socket | null = null

  return next => (action: any) => {
    const { dispatch, getState } = store
    const {
      connectionStart,
      connectionClose,
      connectionEstablished,
      connectionClosed,
      dataReceived,
    } = socketActions

    // Function to roll back a failed driver update
    const rollbackDriver = () => {
      const { driverToRollBack } = getState().drivers

      if (driverToRollBack) {
        dispatch(updateDriverFailure(driverToRollBack))
      }
    }

    // Check for connection actions
    if (action.type === connectionStart.type && !socket) {
      socket = io("http://localhost:8000")

      // Listen for the "connect" event
      socket.on("connect", () => {
        notifications.show({
          title: "Connected to Server",
          message: "You are now connected to the server.",
          color: "green",
          autoClose: 5000,
        })
        dispatch(connectionEstablished())
      })

      // Listen for the "updateState" event from the server
      socket.on("updateState", (state: DriverState) => {
        notifications.show({
          title: "Drivers Updated",
          message: "Client drivers have been updated.",
          autoClose: 5000,
        })
        dispatch(dataReceived(state.drivers))
      })

      // Listen for the "disconnect" event
      socket.on("disconnect", () => {
        notifications.show({
          title: "Disconnected from Server",
          message: "You have been disconnected from the server.",
          color: "red",
          autoClose: 5000,
        })
        dispatch(connectionClosed())
      })
    }

    // Check for closing connection
    if (action.type === connectionClose.type && socket) {
      socket.disconnect()
    }

    // Listen for the "request" action
    if (action.type === updateDriverRequest.type) {
      // Check if the socket is connected
      if (!socket || !socket.connected) {
        notifications.show({
          title: "Unable to update driver",
          message: "No connection detected. Please connect to the server.",
          color: "red",
          autoClose: 5000,
        })
        // Handle offline case: dispatch failure immediately
        rollbackDriver()
        return
      }
      // Emit with an acknowledgement callback
      socket.timeout(3000).emit(
        "updateDriver",
        action.payload,
        // This callback is executed by the server
        (err: boolean, response: { success: boolean; error?: string }) => {
          if (err) {
            // Handles timeouts
            notifications.show({
              title: "Update Failed",
              message: "Server acknowledgment timed out. Rolling back.",
              color: "red",
              autoClose: 5000,
            })
            rollbackDriver()
            return
          }

          // Handles server response
          if (response && response.success) {
            // On success
            notifications.show({
              title: `Update Success for ${action.payload.name}`,
              message: `Delivery status successfully changed to ${action.payload.status}.`,
              color: "green",
              autoClose: 5000,
            })
            dispatch(updateDriverSuccess(action.payload))
          } else {
            // On failure
            const serverError =
              response?.error || "Malformed or empty response from server."
            notifications.show({
              title: "Update Failed",
              message: serverError,
              color: "red",
              autoClose: 5000,
            })

            // Get the original driver data from the store
            rollbackDriver()
          }
        },
      )
    }

    return next(action)
  }
}

export default socketMiddleware
