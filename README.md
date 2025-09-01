# Real-Time Logistics Tracker (Delivery Dispatch)

## Instructions

To get started, complete the following steps:

1. Download the source code or clone this repository using `git clone`

2. In the **client** and **server** folders, open your preferred CLI and install dependencies with `npm i` or `npm install` (it may take a little while)

3. Start the client and the WebSocket server by typing `npm start` in both CLI's 
> **Note**: The initial load time for the client might be several seconds, as it needs to load the icons library (I'd make it smaller if I could!)

4. Use the dropdown in the header to filter the drivers by delivery status 

5. Interact with the buttons in the sidebar and select an action

6. Monitor the WebSocket server CLI for changes in the console

7. Test out the app's responsiveness and keyboard navigation (optional)

8. Enjoy!

## Explanation of architectural decisions and design trade-offs

This app was built using **TypeScript**, **React**, **Redux Toolkit**, **Leaflet**, **Socket.io**, **Express**, and **Mantine**.

I chose **Redux Toolkit** to manage the global state as it is the framework I am most familiar with. I created three slices to handle data transfers and storage:
- `mapSlice` to handle map changes,
- `driverSlice` to manage driver data, and 
- `socketSlice` to communicate with the server

I added `socketMiddleware` so the app could listen and react to changes between the WebSocket server and the client.

For easy WebSocket use, I used **Socket.io**. The server portion uses **Socket.io** and **Express**. Both of these libraries allowed me to set up a server environment quickly and easily.

I used **Leaflet** and **React Leaflet** for the map. **Leaflet** is an open-source JavaScript library, which makes it easy to set up and use.

Lastly, to quickly set up a functional and aesthetic UI, I decided to add a UI components library. I checked out a few options, and eventually opted for **Mantine**. The components in the library look stylish, and their implementation seemed fairly simple.

## Known limitations/Areas that could be further optimized

#### Data Changes are Not Saved

- The WebSocket server uses pre-set data, and any changes made on the client are not saved once the server connection is closed.

- Setting up a database and creating a connection between the server and the database could easily remedy this issue.

#### Server Infrastructure Is Not Scalable

- As the WebSocket server runs on a single thread, it is fine for a few users, but there is no infinite scalability. If the WebSocket server crashes, it will cause every client to disconnect, as there is no redundancy in place.

- Currently, the DOM updates immediately when data is received from the server. If numerous client connections are constantly making updates, this will force the app to re-render each time an update is received. Too many re-renders at once may cause the UI to become unresponsive.

- Multiple connected clients at once, all assigning changes, will create a bottleneck in event processing on the server, causing latency issues for all clients.

- For each driver that exist in the data, the app displays a button and a marker on the map. Adding several (hundreds) more drivers would increase the load on the DOM. The map and the markers are currently not optimized to handle that many all at once.

#### Issues with UI Components and Icons libraries

- Components libraries are usually a good way to get an app up and running, but if I had more time, I would have created something more custom (using either plain CSS with SASS, or TailwindCSS).

- Mantine is a UI library that I was not entirely familiar with, so there were some hurdles I encountered when I started trying to tie everything together. Some CSS styles were added inline or through custom classes.

- The entire component library is listed as a dependency in the `package.json` file. Limiting the dependencies to only the components that were used would help with optimization.

- As with Mantine, I've added the entire `@tabler/icons-react` library to the project. It's not ideal (at all!) but the icons help some parts of the app stand out. If I had the time, I would have copied the `svg` code from [Tabler Icons](https://tabler.io/icons) and created custom components to use instead.

#### Missing Testing Setup

- There is no unit testing or component testing implemented in this project.

- A test suite is crucial for an application's scalability. Testing each event, communication between the client and server, and the component's rendered data would help find points of failure in the infrastucture of both the client and the server.

### Thanks for checking out my project!