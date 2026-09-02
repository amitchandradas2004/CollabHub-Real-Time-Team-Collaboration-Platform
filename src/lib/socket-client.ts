import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    socket = io(serverUrl, {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};
