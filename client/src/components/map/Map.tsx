import { useEffect, useRef } from "react"
import { useAppSelector } from "../../app/hooks"
import { selectCenter } from "./mapSlice"
import { selectDrivers } from "../drivers/driversSlice"
import type { Driver } from "../drivers/driversSlice"
import {
  MapContainer,
  TileLayer,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet"
import { Marker } from "@adamscybot/react-leaflet-component-marker"
import "leaflet/dist/leaflet.css"
import { v4 as uuidv4 } from "uuid"
import { Avatar, Badge, Text } from "@mantine/core"
import styles from "./Map.module.css"

const CustomMarker = (driver: Driver) => {
  const map = useMap()
  // TypeScript complains that the Marker component doesn't have the "openPopup" method, but it does, so let's silence the error
  //@ts-ignore
  const markerRef = useRef<Marker<any> | null>(null)
  const center = useAppSelector(selectCenter)

  useEffect(() => {
    if (center === driver.location) {
      setTimeout(() => {
        map.panTo([driver.location[0], driver.location[1]], {
          animate: true,
          duration: 0.5,
        })
      }, 1000)
      if (markerRef.current) {
        markerRef.current.openPopup()
      }
    }
  }, [center])

  const deliveryStatus =
    driver.deliveryStatus === "Delivering"
      ? "green"
      : driver.deliveryStatus === "Idle"
        ? "yellow"
        : "red"

  return (
    <Marker
      ref={markerRef}
      position={[driver.location[0], driver.location[1]]}
      icon={
        <Avatar
          size="sm"
          radius="xl"
          name={driver.name}
          color={deliveryStatus}
          variant="filled"
          className={styles.markerIcon}
        />
      }
    >
      <Popup>
        <Text size="lg" fw={700} pb="xs">
          {driver.name}
        </Text>
        <Text size="sm" c="dimmed" pb="xs">
          {driver.location[0]}°N, {driver.location[1]}°E
        </Text>
        <Badge fullWidth color={deliveryStatus} variant="filled">
          {driver.deliveryStatus}
        </Badge>
      </Popup>
    </Marker>
  )
}

const Map = () => {
  const center = useAppSelector(selectCenter)
  const drivers = useAppSelector(selectDrivers)

  const driverMarkers = () => {
    if (drivers.length === 0) {
      return null
    }

    return drivers.map((driver: Driver) => (
      <div key={uuidv4()}>
        <CustomMarker {...driver} />
      </div>
    ))
  }

  return (
    <MapContainer
      center={center}
      zoom={10}
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
