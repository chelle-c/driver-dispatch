import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Driver, setCurrentDriver } from "./driversSlice"
import styles from "./Drivers.module.css"
import { useClickOutside } from "@mantine/hooks"

const DriverPanel = (driver: Driver) => {
	
	const ref = useClickOutside(() => {
		
	})

	return (
		<div ref={ref} className={styles.driverPanel}>
			<h2>{driver.name}</h2>
			<p>Location: {driver.location}</p>
			<p>Delivery Status: {driver.deliveryStatus}</p>
		</div>
	)
}

export default DriverPanel