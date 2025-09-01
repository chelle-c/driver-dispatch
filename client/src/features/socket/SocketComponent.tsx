import { useEffect } from "react"
import { useAppDispatch } from "../../app/hooks"
import { socketActions } from "./socketSlice"

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
    dispatch(socketActions.connectionStart())

    return () => {
      dispatch(socketActions.connectionClose())
    }
  }, [])

  return <></>
}

export default SocketComponent
