import { Socket } from "socket.io-client"
import { DefaultEventsMap } from "@socket.io/component-emitter"
import { Action, Dispatch, Middleware } from "@reduxjs/toolkit"
import assignSocketEventHandlers from "./eventHandlers"

export const socketMiddleware =
  (io: Socket<DefaultEventsMap, DefaultEventsMap>): Middleware =>
  ({ dispatch }: { dispatch: Dispatch<Action> }) =>
  next =>
  action => {
    if (
      !(
        typeof action === "object" &&
        action !== null &&
        "type" in action &&
        "payload" in action
      )
    ) {
      console.error("Received action is not a valid action")
      return
    }

    const { type, payload } = action

    switch (type) {
      case "socket/connect":
        io.connect()
        assignSocketEventHandlers(io, dispatch)
        break
      case "socket/disconnect":
        io.disconnect()
        break
      case "socket/ping-server":
        io.emit("ping-server", payload)
        break
      default:
        break
    }

    return next(action)
  }
