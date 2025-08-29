import { Socket } from "socket.io-client"
import { DefaultEventsMap } from "@socket.io/component-emitter"
import { Action, Dispatch } from "@reduxjs/toolkit"

const assignSocketEventHandlers = (
  io: Socket<DefaultEventsMap, DefaultEventsMap>,
  dispatch: Dispatch<Action>,
) => {
  io.connect()
  io.on("connect", () => {
    console.log("Connected")
    dispatch({
      type: "socket/ping-server",
      payload: { msg: "Hello. I'm Client" },
    })
  })

  io.on("disconnect", () => {
    console.log("Disconnected")
  })

  io.on("ping-client", (data: unknown) => {
    console.log("ping-client event received from server", data)
  })
}

export default assignSocketEventHandlers
