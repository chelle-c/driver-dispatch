import { useAppSelector } from "./app/hooks"
import { selectCurrentDriver } from "./components/drivers/driversSlice"
import Map from "./components/map/Map"
import Drivers from "./components/drivers/DriversList"
import DriverFilter from "./components/drivers/DriverFilter"
import DriverPanel from "./components/drivers/DriverPanel"
import SocketComponent from "./components/serverComponent/SocketComponent"
import { AppShell, ScrollArea } from "@mantine/core"

const Layout = () => {
  const currentDriver = useAppSelector(selectCurrentDriver)
  return (
    <AppShell
      header={{ height: { base: 76 } }}
      navbar={{ width: 244, breakpoint: "sm" }}
    >
      <AppShell.Header>
        <DriverFilter />
      </AppShell.Header>
      <AppShell.Navbar bg={"rgba(112, 76, 182, 0.1)"}>
        <ScrollArea>
          <Drivers />
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
        {currentDriver && <DriverPanel {...currentDriver} />}
        <SocketComponent />
        <Map />
      </AppShell.Main>
    </AppShell>
  )
}

export default Layout
