import { Flex, NativeSelect, Text } from "@mantine/core"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectDrivers, setFilteredDrivers } from "./driversSlice"
import { IconChevronDown } from "@tabler/icons-react"
import styles from "./Drivers.module.css"

const DriverFilter = () => {
  const dispatch = useAppDispatch()
  const drivers = useAppSelector(selectDrivers)

  useEffect(() => {
    dispatch(setFilteredDrivers(drivers))
  }, [drivers])

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
    dispatch(setFilteredDrivers(driversFilter(filter)))
  }

  return (
    <Flex
      p="md"
      gap={{ base: "sm", sm: "lg" }}
      direction={{ base: "column", sm: "row" }}
      align="center"
      justify={{ sm: "center", md: "flex-start" }}
    >
      <Text size="xl" fw={700}>
        Live Driver Tracking
      </Text>
      <NativeSelect
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
