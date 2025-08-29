import { useEffect } from "react"
import { useAppDispatch } from "./app/hooks"
import Map from "./components/map/Map"
import Drivers from "./components/drivers/Drivers"
import DriverFilter from "./components/drivers/DriverFilter"
import WebSocketComponent from "./components/serverComponent/WebSocketComponent"
import { AppShell } from "@mantine/core"
import "./App.css"

export const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch({ type: "socket/connect" })
    return () => {
      dispatch({ type: "socket/disconnect" })
    }
  }, [dispatch])

  return (
    <div className="App">
      <AppShell
        header={{ height: { base: 76 } }}
        navbar={{ width: 244, breakpoint: "sm" }}
        footer={{ height: 60 }}
      >
        <AppShell.Header>
          <DriverFilter />
        </AppShell.Header>
        <AppShell.Navbar bg={"rgba(112, 76, 182, 0.1)"}>
          <Drivers />
        </AppShell.Navbar>
        <AppShell.Main>
          <Map />
        </AppShell.Main>
        <AppShell.Footer>
          <WebSocketComponent />
        </AppShell.Footer>
      </AppShell>
    </div>
  )
}
