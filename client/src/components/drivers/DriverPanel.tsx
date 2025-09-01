import type { JSX } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  setCurrentDriver,
  selectDrivers,
  selectCurrentDriver,
  updateDriver,
  updateServerDrivers
} from "./driversSlice"
import type { Driver } from "../../types/types"
import {
  Avatar,
  Badge,
  Button,
  CloseButton,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
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

const DriverPanel = () => {
  const dispatch = useAppDispatch()
  const allDrivers = useAppSelector(selectDrivers)
  const currentDriver = useAppSelector(selectCurrentDriver)

  if (!currentDriver) {
    return <></>
  }

  const statuses: { [key: string]: { color: string; icon: JSX.Element } } = {
    Delivering: { color: "green", icon: <IconTruckDelivery size={16} /> },
    Idle: { color: "yellow", icon: <IconClockPin size={16} /> },
    Paused: { color: "red", icon: <IconNavigationPause size={16} /> },
  }

  const colours = {
    green: "#37b24d",
    yellow: "#f59f00",
    red: "#f03e3e",
  }

  const handleClose = () => {
    dispatch(setCurrentDriver(null))
  }

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

  const idleDrivers = allDrivers.filter(
    driver => driver.deliveryStatus === "Idle",
  )

  const handleDeliveryComplete = () => {
    const updatedDriver = { ...currentDriver, deliveryStatus: "Idle" }
    dispatch(updateDriver(updatedDriver))
    notifications.show({
      title: "Delivery Completed",
      message: `${currentDriver.name}'s delivery has been completed.`,
      color: "green",
    })
    handleClose()
  }

  const handlePauseDelivery = () => {
    const updatedDriver = { ...currentDriver, deliveryStatus: "Paused" }
    dispatch(updateDriver(updatedDriver))
    notifications.show({
      title: "Delivery Paused",
      message: `${currentDriver.name}'s delivery has been paused.`,
      color: "red",
    })
    handleClose()
  }

  const handleAssignDelivery = () => {
    const updatedDriver = { ...currentDriver, deliveryStatus: "Delivering" }
    dispatch(updateDriver(updatedDriver))
    notifications.show({
      title: "Delivery Assigned",
      message: `${currentDriver.name}'s delivery has been assigned.`,
      color: "green",
    })
    handleClose()
  }

  const handleReassignDelivery = (otherDriver: Driver) => {
    const updatedOtherDriver = { ...otherDriver, deliveryStatus: "Delivering" }
    dispatch(updateDriver(updatedOtherDriver))
    const updatedDriver = { ...currentDriver, deliveryStatus: "Idle" }
    dispatch(updateDriver(updatedDriver))
    notifications.show({
      title: "Delivery Reassigned",
      message: `Delivery has been reassigned to ${otherDriver.name}.`,
      color: "green",
    })
    handleClose()
  }

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
                    <Avatar
                      size="sm"
                      radius="xl"
                      name={idleDriver.name}
                      color="initials"
                      variant="filled"
                    />
                    <Text>{idleDriver.name}</Text>
                  </Group>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Button.Group>
      </Stack>
    )
  }

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

  return (
    <Stack id="driver-panel" className={styles.driverPanel}>
      <Group grow preventGrowOverflow={false} align="flex-start">
        <Group align="center" gap="md" wrap="nowrap">
          <Avatar
            size="lg"
            radius="xl"
            name={currentDriver.name}
            color="initials"
            variant="filled"
          />
          <Stack gap={0}>
            <Text size="xl" fw={700}>
              {currentDriver.name}
            </Text>
            <Badge
              color={statuses[currentDriver.deliveryStatus].color}
              variant="filled"
              size="md"
              radius="xs"
              leftSection={statuses[currentDriver.deliveryStatus].icon}
            >
              {currentDriver.deliveryStatus}
            </Badge>
            <Text size="md" c="dimmed">
              {currentDriver.location[0]}°N, {currentDriver.location[1]}°E
            </Text>
          </Stack>
        </Group>
        <CloseButton
          aria-label="Close"
          onClick={() => handleClose()}
          icon={<IconX size={20} stroke={2.5} color="gray" />}
        />
      </Group>
      <Stack>
        <Text size="sm" c="dimmed" fw={500}>
          Actions
        </Text>
        {currentDriver.deliveryStatus === "Delivering"
          ? deliveringActions()
          : currentDriver.deliveryStatus === "Idle"
            ? idleActions()
            : pausedActions()}
      </Stack>
    </Stack>
  )
}

export default DriverPanel
