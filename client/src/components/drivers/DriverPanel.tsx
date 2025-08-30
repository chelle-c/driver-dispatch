import { useAppDispatch } from "../../app/hooks"
import {
  Driver,
  setCurrentDriver,
} from "./driversSlice"
import { ActionIcon } from "@mantine/core"
import {IconX} from "@tabler/icons-react"
import styles from "./Drivers.module.css"

const DriverPanel = (driver: Driver) => {

  const dispatch = useAppDispatch()

  const handleClose = () => {
	dispatch(setCurrentDriver(null))
  }

  return (
    <div id="driver-panel" className={styles.driverPanel}>
      <div>
        <h2>{driver.name}</h2>
        <p>Location: {driver.location}</p>
        <p>Delivery Status: {driver.deliveryStatus}</p>
      </div>
      <div>
        <ActionIcon
          variant="transparent"
          color="gray"
          aria-label="Close"
          onClick={() => handleClose()}
        >
          <IconX size={20} />
        </ActionIcon>
      </div>
    </div>
  )
}

export default DriverPanel
