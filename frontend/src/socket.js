import { io } from "socket.io-client";

const socket = io("https://backend-548h.onrender.com", {
  transports: ["websocket"]
});

export default socket;
