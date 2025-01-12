import { useEffect } from 'react'
import { useSocket } from '@/providers/SocketProvider'

export function useEventSocket(eventId: string, {
  onNewAttendee,
  onEventFull
}: {
  onNewAttendee?: (data: { eventId: string, attendee: string }) => void
  onEventFull?: (data: { eventId: string }) => void
} = {}) {
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.emit('joinEvent', eventId)

    if (onNewAttendee) {
      socket.on('newAttendee', onNewAttendee)
    }

    if (onEventFull) {
      socket.on('eventFull', onEventFull)
    }

    return () => {
      if (socket.connected) {
        socket.emit('leaveEvent', eventId)
        socket.off('newAttendee')
        socket.off('eventFull')
      }
    }
  }, [socket, isConnected, eventId, onNewAttendee, onEventFull])

  return { socket, isConnected }
}
