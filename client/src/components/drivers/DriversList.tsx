import { createRef } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  selectFilteredDrivers,
  setCurrentDriver,
} from "./driversSlice"
import type { Driver, Drivers } from "./driversSlice"
import { setCenter } from "../map/mapSlice"

import {
  Avatar,
  Flex,
  Indicator,
  Text,
  UnstyledButton,
} from "@mantine/core"
import { v4 as uuidv4 } from "uuid"
import styles from "./Drivers.module.css"

interface DriversProps {
  driver: Driver
  handleSelectedDriver: (driver: Driver) => void
}

// Component to display drivers in the dispatch panel
export const DriverDetails: React.FC<DriversProps> = ({
  driver,
  handleSelectedDriver,
}) => {
  const ref = createRef<HTMLButtonElement>();

  const indicatorColour =
    driver.deliveryStatus === "Delivering"
      ? "green"
      : driver.deliveryStatus === "Idle"
        ? "yellow"
        : "red"

  return (
    <UnstyledButton
      ref={ref}
      style={{
        background: "white",
        cursor: "pointer",
        border: "1px solid rgba(122, 122, 122, 0.3)",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(122, 122, 122, 0.2)",
        padding: "1em",
        width: "100%",
        userSelect: "none",
        marginBottom: "0.3em",
      }}
      className={styles.driverCard}
      p="xs"
      onClick={() => handleSelectedDriver(driver)}
    >
      <Flex gap="md" direction="row" align="center" justify="flex-start">
        <Indicator
          inline
          size={20}
          offset={6}
          position="bottom-end"
          color={indicatorColour}
          withBorder
        >
          <Avatar
            size="md"
            radius="xl"
            name={driver.name}
            color="initials"
            variant="outline"
          />
        </Indicator>
        <Text size="xl" fw={700}>
          {driver.name}
        </Text>
      </Flex>
      <Flex gap="xs" direction="column" align="start" justify="flex-start">
        <Text size="sm" c="dimmed">
          {driver.location[0]}°N, {driver.location[1]}°E
        </Text>
      </Flex>
    </UnstyledButton>
  )
}

const Drivers = () => {
  const dispatch = useAppDispatch()
  const filteredDrivers = useAppSelector(selectFilteredDrivers)

  const handleSelectedDriver = (driver: Driver) => {
    dispatch(setCenter(driver.location))
    dispatch(setCurrentDriver(driver))
  }

  return (
    <>
      {filteredDrivers.length > 0 ? (
        <Flex
          direction="column"
          gap={4}
          className={styles.driversContainer}
          align="center"
          p="xs"
        >
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
    </>
  )
}

export default Drivers
