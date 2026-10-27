import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    // In browser, connect to current host/port
    const serverUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000';

    socketInstance = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to QUIZ MASTER server, socket id:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from QUIZ MASTER server:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('Socket connection error:', error.message);
    });
  }

  return socketInstance;
}
