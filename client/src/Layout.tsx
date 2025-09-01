
import React from "react"
import { useAppSelector } from "./app/hooks"
import { selectCurrentDriver } from "./components/drivers/driversSlice"
import Map from "./components/map/Map"
import DriversList from "./components/drivers/DriversList"
import DriverFilter from "./components/drivers/DriverFilter"
import DriverPanel from "./components/drivers/DriverPanel"
import SocketComponent from "./components/SocketComponent"
import { AppShell, ScrollArea, Group, Burger, Container } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

const Layout = React.memo(() => {
  const [opened, { toggle }] = useDisclosure()

  const currentDriver = useAppSelector(selectCurrentDriver)
  return (
    <AppShell
      padding={{ base: 0, sm: 8 }}
      header={{ height: { base: "12vh" } }}
      navbar={{
        width: { base: 300, md: 300 },
        breakpoint: "sm",
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
        <Group h="100%" px="md" wrap="nowrap" style={{ width: "100%" }}>
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
