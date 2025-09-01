import type { JSX } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  setCurrentDriver,
  selectDrivers,
  selectCurrentDriver,
  updateDriverRequest,
} from "./driversSlice"
import type { Driver } from "../../types/types"
import {
  Avatar,
  Badge,
  Button,
  CloseButton,
  Divider,
  Group,
  Indicator,
  Menu,
  Stack,
  Text,
} from "@mantine/core"
import {
  IconX,
  IconTruckDelivery,
  IconNavigationPause,
  IconClockPin,
  IconChevronDown,
  IconPlayerPause,
  IconPackageExport,
  IconCheck,
} from "@tabler/icons-react"
import styles from "./Drivers.module.css"

/**
 * The DriverPanel component displays a driver's name, avatar, location, and
 * status, and provides actions for the currently selected driver.
 * If the driver is delivering, the component displays an ETA and allows the
 * user to pause or mark the delivery as completed.
 * If the driver is idle, the component allows the user to assign a delivery.
 * If the driver is paused, the component allows the user to resume the delivery.
 *
 * @returns A JSX element representing the DriverPanel component.
 */
const DriverPanel = () => {
  const dispatch = useAppDispatch()
  const allDrivers = useAppSelector(selectDrivers)
  const currentDriver = useAppSelector(selectCurrentDriver)

  // If no driver is selected, return an empty element
  if (!currentDriver) {
    return <></>
  }

  // Define the colors for each status
  const colours = {
    green: "#37b24d",
    yellow: "#f59f00",
    red: "#f03e3e",
  }

  // Define the icons for each status
  const statuses: { [key: string]: { color: string; icon: JSX.Element } } = {
    Delivering: { color: colours.green, icon: <IconTruckDelivery size={16} /> },
    Idle: { color: colours.yellow, icon: <IconClockPin size={16} /> },
    Paused: { color: colours.red, icon: <IconNavigationPause size={16} /> },
  }

  // Function to close the driver panel
  const handleClose = () => {
    dispatch(setCurrentDriver(null))
  }

  // A helper function to create a button with a label, icon, and an optional
  // click handler and dropdown indicator.
  const CreateActionButton = (
    label: string,
    icon: JSX.Element,
    handler?: () => void | null,
    dropDown?: boolean | null,
  ) => {
    return (
      <Button
        fullWidth
        variant="default"
        color="black"
        justify="space-between"
        leftSection={icon}
        rightSection={dropDown ? <IconChevronDown size={16} /> : <></>}
        onClick={handler}
      >
        {label}
      </Button>
    )
  }

  // Get drivers with the "Idle" status
  const idleDrivers = allDrivers.filter(driver => driver.status === "Idle")

  // Function to handle marking the currently selected driver's delivery as completed
  const handleDeliveryComplete = () => {
    const updatedDriver = { ...currentDriver, status: "Idle" }
    dispatch(updateDriverRequest(updatedDriver))
    handleClose()
  }

  // Function to handle pausing a delivery for the current driver
  const handlePauseDelivery = () => {
    const updatedDriver = { ...currentDriver, status: "Paused" }
    dispatch(updateDriverRequest(updatedDriver))
    handleClose()
  }

  // Function to handle assigning a delivery to the current driver
  const handleAssignDelivery = () => {
    const updatedDriver = { ...currentDriver, status: "Delivering" }
    dispatch(updateDriverRequest(updatedDriver))
    handleClose()
  }

  // Function to handle reassigning a delivery to a driver with the "Idle" status
  const handleReassignDelivery = (otherDriver: Driver) => {
    // Update the status of the driver with the "Idle" status
    const updatedOtherDriver = { ...otherDriver, status: "Delivering" }
    dispatch(updateDriverRequest(updatedOtherDriver))

    // Update the status of the current driver
    const updatedDriver = { ...currentDriver, status: "Idle" }
    dispatch(updateDriverRequest(updatedDriver))
    handleClose()
  }

  // A component to render the actions for a driver with the "Delivering" status
  const deliveringActions = () => {
    return (
      <Stack>
        <Button.Group
          orientation="vertical"
          bg={"rgba(112, 76, 182, 0.1)"}
          style={{ padding: "0.5em" }}
        >
          {CreateActionButton(
            "Mark Delivery Completed",
            <IconCheck size={16} color={colours.green} />,
            handleDeliveryComplete,
          )}
          {CreateActionButton(
            "Pause Delivery",
            <IconPlayerPause size={16} color={colours.red} />,
            handlePauseDelivery,
          )}
          <Menu
            position="bottom-end"
            withArrow
            trigger="click-hover"
            closeDelay={300}
            transitionProps={{ transition: "pop-top-right", duration: 300 }}
          >
            <Menu.Target>
              {CreateActionButton(
                "Reassign Delivery",
                <IconPackageExport size={16} color={colours.yellow} />,
                undefined,
                true,
              )}
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Reassign to:</Menu.Label>
              {idleDrivers.map(idleDriver => (
                <Menu.Item
                  key={idleDriver.id}
                  onClick={() => {
                    handleReassignDelivery(idleDriver)
                  }}
                >
                  <Group>
                    <Indicator
                      inline
                      size={12}
                      offset={4}
                      position="bottom-end"
                      color={statuses[idleDriver.status].color}
                      withBorder
                    >
                      <Avatar
                        size="sm"
                        radius="xl"
                        name={idleDriver.name}
                        src={idleDriver.avatar}
                        color="initials"
                        variant="filled"
                      />
                    </Indicator>
                    <Text c="gray.8" size="md" fw={600}>
                      {idleDriver.name}
                    </Text>
                  </Group>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Button.Group>
      </Stack>
    )
  }

  // A component to render the actions for a driver with the "Idle" status
  const idleActions = () => {
    return (
      <Stack>
        <Button.Group
          orientation="vertical"
          bg={"rgba(112, 76, 182, 0.1)"}
          style={{ padding: "0.5em" }}
        >
          {CreateActionButton(
            "Assign Delivery",
            <IconTruckDelivery size={16} color={colours.green} />,
            handleAssignDelivery,
          )}
        </Button.Group>
      </Stack>
    )
  }

  // A component to render the actions for a driver with the "Paused" status
  const pausedActions = () => {
    return (
      <Stack>
        <Button.Group
          orientation="vertical"
          bg={"rgba(112, 76, 182, 0.1)"}
          style={{ padding: "0.5em" }}
        >
          {CreateActionButton(
            "Resume Delivery",
            <IconClockPin size={16} color={colours.yellow} />,
            handleAssignDelivery,
          )}
        </Button.Group>
      </Stack>
    )
  }

  // Render the driver panel
  return (
    <Stack
      id="driver-panel"
      className={styles.driverPanel}
      style={{
        borderTop: `8px solid ${statuses[currentDriver.status].color}`,
      }}
      gap="sm"
    >
      <Group
        p="sm"
        gap="sm"
        grow
        preventGrowOverflow={false}
        wrap="nowrap"
        align="flex-start"
      >
        <Group align="center" gap="md" wrap="nowrap">
          <Avatar
            size="lg"
            radius="xl"
            name={currentDriver.name}
            src={currentDriver.avatar}
            color="initials"
            variant="filled"
          />
          <Stack gap={4}>
            <Text size="xl" fw={700}>
              {currentDriver.name}
            </Text>
            <Badge
              color={statuses[currentDriver.status].color}
              variant="filled"
              size="md"
              radius="xs"
              leftSection={statuses[currentDriver.status].icon}
            >
              {currentDriver.status}
            </Badge>
            <Text size="md" c="gray.7">
              {currentDriver.latitude}°N, {currentDriver.longitude}°E
            </Text>
          </Stack>
        </Group>
        <CloseButton
          size="lg"
          aria-label="Close"
          onClick={() => handleClose()}
          icon={<IconX size={20} stroke={2.5} color="gray" />}
        />
      </Group>
      {currentDriver.status === "Delivering" ? (
        <Group gap="xs" align="center">
          <Text size="md" c="gray.8" fw={700}>
            ETA:
          </Text>
          <Text size="md" c="gray.8" fw={600}>
            15 minutes
          </Text>
        </Group>
      ) : null}
      <Stack gap="xs">
        <Divider size="sm" color="gray.3" />
        <Text size="md" c="gray.7" fw={500}>
          Actions
        </Text>
        {currentDriver.status === "Delivering"
          ? deliveringActions()
          : currentDriver.status === "Idle"
            ? idleActions()
            : pausedActions()}
      </Stack>
    </Stack>
  )
}

export default DriverPanel
