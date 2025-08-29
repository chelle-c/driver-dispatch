import Map from "./components/map/Map"
import Drivers from "./components/drivers/Drivers"
import DriverFilter from "./components/drivers/DriverFilter"
import SocketComponent from "./components/serverComponent/SocketComponent"
import { AppShell } from "@mantine/core"
import "./App.css"

export const App = () => {
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
          <SocketComponent />
        </AppShell.Footer>
      </AppShell>
    </div>
  )
}
