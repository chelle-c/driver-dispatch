
import React from "react"
import { useAppSelector } from "./app/hooks"
import { selectCurrentDriver } from "./features/drivers/driversSlice"
import Map from "./features/map/Map"
import DriversList from "./features/drivers/DriversList"
import DriverFilter from "./features/drivers/DriverFilter"
import DriverPanel from "./features/drivers/DriverPanel"
import SocketComponent from "./features/socket/SocketComponent"
import { AppShell, ScrollArea, Group, Burger, Container } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

/**
 * The top-level component for the application. It renders a Mantine AppShell component 
 * with a header containing a Burger menu button and the driver filter dropdown, 
 * a sidebar containing a filtered list of drivers and the socket component, 
 * and a main area containing a map and a driver panel (if a driver is selected). 
 * The component uses the `useDisclosure` hook to manage the state of the navbar.
 * The component uses `React.memo` to prevent unnecessary re-renders when the state 
 * of the component does not change.
 */
const Layout = React.memo(() => {
  const [opened, { toggle }] = useDisclosure()

  const currentDriver = useAppSelector(selectCurrentDriver)
  return (
    <AppShell
      padding={{ base: 0, sm: 8, md: 0, lg: 0 }}
      header={{ height: { base: "20vh", xs: "16vh", sm: "12vh", md: "12vh", lg: "12vh" } }}
      navbar={{
        width: { base: 300, md: 300 },
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      style={{
        height: "100dvh",
      }}
    >
      <AppShell.Header
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          padding: "1em 0",
        }}
      >
        <Group h="100%" pr="md" wrap="nowrap" style={{ width: "100%" }}>
          <Container fluid>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="lg"
              size="md"
            />
          </Container>
          <DriverFilter />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <ScrollArea bg={"rgba(112, 76, 182, 0.1)"} style={{ height: "100%" }}>
          <SocketComponent />
          <DriversList />
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          position: "relative",
          zIndex: 0,
          overflow: "hidden",
          paddingTop: 0,
        }}
      >
        {currentDriver && <DriverPanel />}
        <Map />
      </AppShell.Main>
    </AppShell>
  )
})

export default Layout
