export type Driver = {
  id: number
  name: string
  avatar: string
  latitude: number
  longitude: number
  status: string
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

export interface SocketState {
  isConnected: boolean
}
