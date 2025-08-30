import { useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectCenter } from "./mapSlice"
import {
  selectFilteredDrivers,
  setCurrentDriver,
} from "../drivers/driversSlice"
import type { Driver } from "../drivers/driversSlice"
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet"
import { Marker } from "@adamscybot/react-leaflet-component-marker"
import "leaflet/dist/leaflet.css"
import { v4 as uuidv4 } from "uuid"
import { Avatar } from "@mantine/core"
import styles from "./Map.module.css"

const CustomMarker = (driver: Driver) => {
  const map = useMap()
  // TypeScript complains that the Marker component doesn't have the "openPopup" method, but it does, so let's silence the error
  //@ts-ignore
  const markerRef = useRef<Marker<any> | null>(null)
  const dispatch = useAppDispatch()
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
      eventHandlers={{
        click: () => dispatch(setCurrentDriver(driver)),
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
          color={deliveryStatus}
          variant="filled"
          className={styles.markerIcon}
        />
      }
    ></Marker>
  )
}

const Map = () => {
  const center = useAppSelector(selectCenter)
  const drivers = useAppSelector(selectFilteredDrivers)

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
