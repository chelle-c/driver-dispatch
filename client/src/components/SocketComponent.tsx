// src/features/chat/ChatComponent.tsx (Updated)

import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { socketActions } from "../utils/socketSlice"

const SocketComponent = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Use the new action name
    dispatch(socketActions.connectionStart())

    return () => {
      // Use the new action name
      dispatch(socketActions.connectionClose())
    }
  }, [dispatch])

  // ... (The JSX for the component is the same) ...
  return (
    <></>
  )
}

export default SocketComponent