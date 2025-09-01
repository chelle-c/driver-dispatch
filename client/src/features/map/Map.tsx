import { useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectCenter, setCenter } from "./mapSlice"
import {
  selectFilteredDrivers,
  setCurrentDriver,
  selectCurrentDriver,
} from "../drivers/driversSlice"
import type { Driver } from "../../types/types"
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet"
import { Marker } from "@adamscybot/react-leaflet-component-marker"
import "leaflet/dist/leaflet.css"
import { v4 as uuidv4 } from "uuid"
import { Avatar } from "@mantine/core"
import styles from "./Map.module.css"

/**
 * A custom marker component that handles the click event and
 * moves the map to the marker's location when clicked.
 * It also updates the current driver when the marker is clicked.
 * The color of the marker is determined by the driver's status.
 * If the driver is delivering, the marker is green.
 * If the driver is idle, the marker is yellow.
 * If the driver is paused, the marker is red.
 *
 * @param driver - The driver object to be rendered as a marker.
 * @returns A JSX element representing the custom marker.
 */
const CustomMarker = (driver: Driver) => {
  const map = useMap()
  // TypeScript complains that the Marker component doesn't have the "openPopup" method, but it does, 
  // so let's silence the error
  //@ts-ignore
  const markerRef = useRef<Marker<any> | null>(null)
  const dispatch = useAppDispatch()
  const center = useAppSelector(selectCenter)
  const currentDriver = useAppSelector(selectCurrentDriver)

  // Handles the click event and moves the map to the marker's location
  const handleMoveToMarker = () => {
    dispatch(setCurrentDriver(driver))
  }

  // When a driver is selected, move the map to the driver's location
  useEffect(() => {
    if (currentDriver && center[0] !== currentDriver.latitude && center[1] !== currentDriver.longitude) {
      // Move the map to the current driver's location
      dispatch(setCenter([currentDriver.latitude, currentDriver.longitude]))
      map.panTo([currentDriver.latitude, currentDriver.longitude], {
        animate: true,
        duration: 0.5,
      })
    }
  }, [currentDriver])

  // Determine the color of the marker based on the driver's status
  const statusColour =
    driver.status === "Delivering"
      ? "green"
      : driver.status === "Idle"
        ? "yellow"
        : "red"

  // Render the marker
  return (
    <Marker
      ref={markerRef}
      position={[driver.latitude, driver.longitude]}
      eventHandlers={{
        click: () => {
          handleMoveToMarker()
        },
        keydown: event => {
          if (event.originalEvent.key === "Enter") {
            dispatch(setCurrentDriver(driver))
          }
        },
      }}
      icon={
        <Avatar
          size="sm"
          radius="xl"
          name={driver.name}
          color={statusColour}
          variant="filled"
          className={styles.markerIcon}
        />
      }
    ></Marker>
  )
}

/**
 * A component that renders a Leaflet map with a list of drivers as markers.
 * When a driver is selected, it moves the map to the driver's location.
 * The map is centered at the center of all the drivers.
 * The map is zoomable and has a zoom control in the bottom right corner.
 * The map tiles are from OpenStreetMap.
 * @returns A JSX element representing the map.
 */
const Map = () => {
  const center = useAppSelector(selectCenter)
  const drivers = useAppSelector(selectFilteredDrivers)

  // Render markers
  const driverMarkers = () => {
    // If there are no drivers, return null
    if (drivers.length === 0) {
      return null
    }

    // Render each driver as a marker
    return drivers.map((driver: Driver) => (
      <div key={uuidv4()}>
        <CustomMarker {...driver} />
      </div>
    ))
  }

  // Render the map
  return (
    <MapContainer
      center={center}
      zoom={7}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      {driverMarkers()}
    </MapContainer>
  )
}

export default Map
