export type Driver = {
  id: number
  name: string
  location: [number, number]
  deliveryStatus: string
}

export type Drivers = Driver[]

export interface DriverState {
  drivers: Driver[]
  filteredDrivers: Driver[]
}

export interface AppState {
  isConnected: boolean
  drivers: Drivers
  filteredDrivers: Drivers
}