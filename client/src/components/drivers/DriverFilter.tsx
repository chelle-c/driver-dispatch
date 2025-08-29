import {
  Container,
  Flex,
  NativeSelect,
} from "@mantine/core"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectDrivers, setFilteredDrivers } from "./driversSlice"
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
    <Container fluid h={80}>
      <Flex gap="md" direction="row" align="center" justify="flex-start">
        <h2>Live Driver Tracking</h2>
        <NativeSelect
          className={styles.filterSelect}
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
    </Container>
  )
}

export default DriverFilter
