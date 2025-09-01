import React from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectFilteredDrivers, setCurrentDriver } from "./driversSlice"
import type { Driver } from "../../types/types"
import { Avatar, Flex, Group, Indicator, Stack, Text, UnstyledButton } from "@mantine/core"
import {IconChevronRight} from "@tabler/icons-react"
import { v4 as uuidv4 } from "uuid"
import styles from "./Drivers.module.css"

interface DriversProps {
  driver: Driver
  handleSelectedDriver: (driver: Driver) => void
}

/**
 * A component that renders a driver's details as a card.
 * 
 * @prop {Driver} driver The driver to render
 * @prop {(driver: Driver) => void} handleSelectedDriver A callback to be called when the driver is selected
 * 
 * @returns A Mantine UnstyledButton component with a Flex component inside
 */
export const DriverDetails: React.FC<DriversProps> = ({
  driver,
  handleSelectedDriver,
}) => {

  // Define the colors for each status
  const statusColour =
    driver.status === "Delivering"
      ? "green"
      : driver.status === "Idle"
        ? "yellow"
        : "red"

  // Render the component
  return (
    <UnstyledButton
      style={{
        background: "white",
        cursor: "pointer",
        border: "1px solid rgba(122, 122, 122, 0.3)",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(122, 122, 122, 0.2)",
        padding: "1em",
        width: "100%",
        height: "auto",
        userSelect: "none",
        marginBottom: "0.3em",
      }}
      className={`${styles.driverCard} driver-card`}
      p="xs"
      onClick={() => handleSelectedDriver(driver)}
    >
      <Flex gap={4} direction="row" align="center" justify="space-between">
        <Stack gap="xs">
          <Flex gap="md" direction="row" align="center" justify="flex-start">
            <Indicator
              inline
              size={20}
              offset={6}
              position="bottom-end"
              color={statusColour}
              withBorder
            >
              <Avatar
                size="md"
                radius="xl"
                name={driver.name}
                src={driver.avatar}
                color="initials"
                variant="outline"
              />
            </Indicator>
            <Text size="xl" fw={700} c="gray.8">
              {driver.name}
            </Text>
          </Flex>

          <Stack gap="xs">
            <Text size="sm" fw={400} c="gray.7">
              {driver.latitude}°N, {driver.longitude}°E
            </Text>
            {driver.status === "Delivering" && (
              <Group gap="xs" align="center">
                <Text size="md" c="gray.8" fw={700}>
                  ETA:
                </Text>
                <Text size="md" fw={500} c="gray.7">15 minutes</Text>
              </Group>
            )}
          </Stack>
        </Stack>
        <IconChevronRight size={20} stroke={2.5} />
      </Flex>
    </UnstyledButton>
  )
}


/**
 * A component to render a list of drivers.
 * It uses `React.memo` to save the scroll position when the component is re-rendered.
 * It uses the `selectFilteredDrivers` selector to get the list of drivers to display.
 * It also uses the `setCurrentDriver` action to dispatch an action to set the current driver.
 * The component renders a list of `DriverDetails` components, each with a driver object and a function to handle when a driver is clicked.
 * If there are no drivers to display, it renders a message saying "No drivers found.".
 */
const DriversList = React.memo(() => {
  const dispatch = useAppDispatch()
  const filteredDrivers = useAppSelector(selectFilteredDrivers)

  // Handle when a driver card is clicked
  const handleSelectedDriver = (driver: Driver) => {
    dispatch(setCurrentDriver(driver))
  }

  // Render the component
  return (
    <div id="drivers-list" className={styles.driversList}>
      {/* Render the list of drivers */}
      {filteredDrivers.length > 0 ? (
        <Flex
          direction="column"
          gap={4}
          className={styles.driversContainer}
          align="start"
          p="xs"
        >
          <Text size="xl" fw={700} mb="xs" c="gray.8">Displaying {filteredDrivers.length} drivers</Text>
          {/* Render each driver card */}
          {filteredDrivers.map(driver => (
            <DriverDetails
              key={uuidv4()}
              driver={driver}
              handleSelectedDriver={() => handleSelectedDriver(driver)}
            />
          ))}
        </Flex>
      ) : (
        <Flex
          direction="column"
          gap="sm"
          className={styles.driversContainer}
          align="center"
          p="lg"
        >
          No drivers found.
        </Flex>
      )}
    </div>
  )
})

export default DriversList
