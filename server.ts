import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server as SocketIOServer } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Create a type-safe reference to the global io instance
const globalWithIO = global as typeof globalThis & {
  io: SocketIOServer | undefined
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    if (req.url?.startsWith('/api/socketio')) {
      res.statusCode = 404
      res.end()
      return
    }

    const parsedUrl = parse(req.url || '', true)
    handle(req, res, parsedUrl)
  })

  // Initialize Socket.IO
  const io = new SocketIOServer(server, {
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

  // Set the global io instance using the typed global
  globalWithIO.io = io

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})

// Update the getter to use the typed global
export function getIO(): SocketIOServer {
  if (!globalWithIO.io) {
    throw new Error('Socket.IO not initialized')
  }
  return globalWithIO.io
}
