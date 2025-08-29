import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  updateDriver,
  selectDrivers,
  selectFilteredDrivers,
} from "./driversSlice"
import type { Driver, Drivers } from "./driversSlice"
import { setCenter } from "../map/mapSlice"
import { Avatar, Flex, Indicator, Menu, Stack, Text } from "@mantine/core"
import { v4 as uuidv4 } from "uuid"
import styles from "./Drivers.module.css"

interface DriversProps {
  driver: Driver
  handleMapLocation: (driver: Driver) => void
  handleDeliveryStatus: (driver: Driver, deliveryStatus: string) => void
}

// Component to display drivers in the dispatch panel
export const DriverDetails: React.FC<DriversProps> = ({
  driver,
  handleMapLocation,
  handleDeliveryStatus,
}) => {
  const drivers = useAppSelector(selectDrivers)

  const indicatorColour =
    driver.deliveryStatus === "Delivering"
      ? "green"
      : driver.deliveryStatus === "Idle"
        ? "yellow"
        : "red"

  return (
    <Menu
      key={driver.id.toString() + driver.name}
      onChange={() => handleMapLocation(driver)}
      position="right"
      offset={10}
      withArrow
      shadow="md"
      width={200}
    >
      <Menu.Target>
        <Stack
          className={styles.driverContainer}
          p="xs"
          align="stretch"
          justify="center"
          gap="xs"
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
            {driver.deliveryStatus === "Delivering" && (
              <Flex
                gap="xs"
                direction="row"
                align="center"
                justify="flex-start"
              >
                <Text size="md" fw={500}>
                  ETA:{" "}
                </Text>
                <Text size="md">15 minutes</Text>
              </Flex>
            )}
          </Flex>
        </Stack>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        {driver.deliveryStatus === "Delivering" && (
          <>
            <Menu.Sub>
              <Menu.Sub.Target>
                <Menu.Sub.Item>
                  <Text size="md" fw={500}>
                    Reassign Delivery
                  </Text>
                </Menu.Sub.Item>
              </Menu.Sub.Target>

              <Menu.Sub.Dropdown>
                {drivers.filter(
                  otherDriver =>
                    otherDriver.id !== driver.id &&
                    otherDriver.deliveryStatus === "Idle",
                ).length > 0 ? (
                  drivers
                    .filter(
                      otherDriver =>
                        otherDriver.id !== driver.id &&
                        otherDriver.deliveryStatus === "Idle",
                    )
                    .map(newDriver => {
                      return (
                        <Menu.Item
                          key={uuidv4()}
                          onClick={() => {
                            handleDeliveryStatus(newDriver, "Delivering")
                            handleDeliveryStatus(driver, "Idle")
                          }}
                        >
                          <Text size="md" fw={500}>
                            {newDriver.name}
                          </Text>
                        </Menu.Item>
                      )
                    })
                ) : (
                  <Text size="md" fw={500} p="xs">
                    No drivers available
                  </Text>
                )}
              </Menu.Sub.Dropdown>
            </Menu.Sub>
            <Menu.Item onClick={() => handleDeliveryStatus(driver, "Idle")}>
              <Text size="md" fw={500}>
                Mark as Completed
              </Text>
            </Menu.Item>
            <Menu.Item>
              <Text
                size="md"
                fw={500}
                onClick={() => handleDeliveryStatus(driver, "Paused")}
              >
                Pause Delivery
              </Text>
            </Menu.Item>
          </>
        )}
        {driver.deliveryStatus === "Idle" && (
          <Menu.Item>
            <Text
              size="md"
              fw={500}
              onClick={() => handleDeliveryStatus(driver, "Delivering")}
            >
              Mark as Delivering
            </Text>
          </Menu.Item>
        )}
        {driver.deliveryStatus === "Paused" && (
          <Menu.Item>
            <Text
              size="md"
              fw={500}
              onClick={() => handleDeliveryStatus(driver, "Delivering")}
            >
              Resume Delivery
            </Text>
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}

const Drivers = () => {
  const dispatch = useAppDispatch()
  const filteredDrivers = useAppSelector(selectFilteredDrivers)

  const handleMapCentering = (driver: Driver) => {
    dispatch(setCenter(driver.location))
  }

  const handleDeliveryStatus = (driver: Driver, status: string) => {
    const updatedDriver: Driver = { ...driver, deliveryStatus: status }
    dispatch(updateDriver(updatedDriver))
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
              handleMapLocation={() => handleMapCentering(driver)}
              handleDeliveryStatus={(driver, status: string) =>
                handleDeliveryStatus(driver, status)
              }
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
