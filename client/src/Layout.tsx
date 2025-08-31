import { useAppSelector } from "./app/hooks"
import { selectCurrentDriver } from "./components/drivers/driversSlice"
import Map from "./components/map/Map"
import Drivers from "./components/drivers/DriversList"
import DriverFilter from "./components/drivers/DriverFilter"
import DriverPanel from "./components/drivers/DriverPanel"
import SocketComponent from "./components/serverComponent/SocketComponent"
import { AppShell, ScrollArea, Group, Burger } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

const Layout = () => {
  const [opened, { toggle }] = useDisclosure()

  const currentDriver = useAppSelector(selectCurrentDriver)
  return (
    <AppShell
      padding={{ base: 0, sm: 8 }}
      header={{ height: { base: 132, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 300, },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header style={{ display: "flex", alignItems: "center" }}>
        <Group p={{ base: "md", sm: 0 }}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <DriverFilter />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <ScrollArea bg={"rgba(112, 76, 182, 0.1)"} style={{ height: "100%" }}>
          <Drivers />
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main style={{ position: "relative", zIndex: 0 }}>
        {currentDriver && <DriverPanel {...currentDriver} />}
        <SocketComponent />
        <Map />
      </AppShell.Main>
    </AppShell>
  )
}

export default Layout
