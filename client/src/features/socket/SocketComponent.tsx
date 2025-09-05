import { useEffect } from "react"
import { useAppDispatch } from "../../app/hooks"
import { connectionStart, connectionClose } from "./socketSlice"

/**
 * A component that starts a socket connection when mounted and closes it when unmounted.
 * It uses the `useAppDispatch` hook to get the dispatch function and the `useEffect` hook to manage
 * the socket connection.
 * The component does not render anything, it is only used to manage the socket connection.
 */
const SocketComponent = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Start the socket connection
    dispatch(connectionStart())

    return () => {
      dispatch(connectionClose())
    }
  }, [])

  return <></>
}

export default SocketComponent
