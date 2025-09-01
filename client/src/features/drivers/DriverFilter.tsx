import { Flex, NativeSelect, Text } from "@mantine/core"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  selectDrivers,
  setFilteredDrivers,
  selectFilteredState,
  setFilteredState,
} from "./driversSlice"
import { IconChevronDown } from "@tabler/icons-react"
import styles from "./Drivers.module.css"

/**
 * A component that renders a dropdown for filtering drivers by status.
 * 
 * On mount, it updates the list of drivers based on the current filter.
 * When the filter changes, it updates the list of drivers again.
 * 
 * @returns A Mantine Flex component with a Text component and a NativeSelect component.
 */
const DriverFilter = () => {
  const dispatch = useAppDispatch()
  const drivers = useAppSelector(selectDrivers)
  const filter = useAppSelector(selectFilteredState)

  // Update the list of drivers when the filter changes
  useEffect(() => {
    dispatch(setFilteredDrivers(driversFilter(filter)))
  }, [drivers, filter])

  // Filter the list of drivers based on the current filter
  const driversFilter = (filterValue: string) => {
    if (filterValue === "All") {
      return drivers
    }

    return drivers.filter(driver =>
      driver.status.toLowerCase().includes(filterValue.toLowerCase()),
    )
  }

  // Handle the filter change
  const handleFilter = (event: any) => {
    const filter = event.target.value
    dispatch(setFilteredState(filter))
    dispatch(setFilteredDrivers(driversFilter(filter)))
  }

  return (
    <Flex
      direction={{ base: "column", sm: "row" }}
      gap={{ base: "xs", md: 72 }}
      justify={{ base: "flex-start", sm: "space-evenly", md: "space-between" }}
      wrap="wrap"
      align="center"
      style={{ width: "100%" }}
    >
      <Text size="xl" fw={700}>
        Live Driver Tracking
      </Text>
      <NativeSelect
        id="filter-select"
        className={styles.filterSelect}
        rightSection={<IconChevronDown size={16} />}
        label="Filter by delivery status"
        data={[
          { value: "All", label: "All" },
          { value: "Delivering", label: "Delivering" },
          { value: "Idle", label: "Idle" },
          { value: "Paused", label: "Paused" },
        ]}
        defaultValue="All"
        onChange={event => handleFilter(event)}
      />
    </Flex>
  )
}

export default DriverFilter
