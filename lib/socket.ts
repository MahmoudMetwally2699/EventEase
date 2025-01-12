import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};
