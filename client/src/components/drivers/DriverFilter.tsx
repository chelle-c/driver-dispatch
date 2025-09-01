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

const DriverFilter = () => {
  const dispatch = useAppDispatch()
  const drivers = useAppSelector(selectDrivers)
  const filter = useAppSelector(selectFilteredState)

  useEffect(() => {
    dispatch(setFilteredDrivers(driversFilter(filter)))
  }, [drivers, filter])

  useEffect(() => {
    const filterSelect = document.querySelector("select")
    if (filterSelect) {
      filterSelect.value = filter
      filterSelect.dispatchEvent(new Event("change"))
    }
  }, [filter])

  const driversFilter = (filterValue: string) => {
    if (filterValue === "All") {
      return drivers
    }

    return drivers.filter(driver =>
      driver.deliveryStatus.toLowerCase().includes(filterValue.toLowerCase()),
    )
  }

  const handleFilter = (event: any) => {
    const filter = event.target.value
    dispatch(setFilteredState(filter))
    dispatch(setFilteredDrivers(driversFilter(filter)))
  }

  return (
    <Flex
      direction={{ base: "column", sm: "row" }}
      gap={{ base: "xs", md: 72 }}
      justify={{ base: "flex-start", sm: "space-evenly", md: "flex-start" }}
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
