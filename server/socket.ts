import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

let io: SocketIOServer | undefined

export const initializeSocket = (server: HTTPServer) => {
  if (io) return io

  io = new SocketIOServer(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected')

    socket.on('joinEvent', (eventId: string) => {
      socket.join(`event:${eventId}`)
    })

    socket.on('leaveEvent', (eventId: string) => {
      socket.leave(`event:${eventId}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  return io
}

export const getSocketIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized')
  }
  return io
}
