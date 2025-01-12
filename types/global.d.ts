import { Server as SocketIOServer } from 'socket.io'

declare global {
  // For globalThis
  let io: SocketIOServer | undefined

  // For NodeJS.Global
  namespace NodeJS {
    interface Global {
      io: SocketIOServer | undefined
    }
  }
}

// This export is needed to make this a module
export {}
