import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Employee } from '../../types';

interface RealtimeSyncOptions {
  onEmployeeAdded: (employee: Employee) => void;
  onEmployeeUpdated: (employee: Employee) => void;
  onEmployeeDeleted: (id: string) => void;
  onTimeOffUpdated: (data: { employeeId: string; date: string; type: string }) => void;
  onTimeOffRemoved: (data: { employeeId: string; date: string }) => void;
  onUserActivity: (data: { userId: string; activity: string; timestamp: string }) => void;
  onCellEdited: (data: unknown) => void;
}

export const useRealtimeSync = (options: RealtimeSyncOptions) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;
    
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setSocket(newSocket);
    }, 0);

    // Connection events
    newSocket.on('connect', () => {
      console.log('🔗 Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    // Real-time events
    newSocket.on('employee_added', (employee: Employee) => {
      console.log('👤 Employee added:', employee);
      options.onEmployeeAdded(employee);
    });

    newSocket.on('employee_updated', (employee: Employee) => {
      console.log('✏️ Employee updated:', employee);
      options.onEmployeeUpdated(employee);
    });

    newSocket.on('employee_deleted', (data: { id: string }) => {
      console.log('🗑️ Employee deleted:', data.id);
      options.onEmployeeDeleted(data.id);
    });

    newSocket.on('timeoff_updated', (data: { employeeId: string; date: string; type: string }) => {
      console.log('📅 Time off updated:', data);
      options.onTimeOffUpdated(data);
    });

    newSocket.on('timeoff_removed', (data: { employeeId: string; date: string }) => {
      console.log('🗑️ Time off removed:', data);
      options.onTimeOffRemoved(data);
    });

    newSocket.on('user_active', (data: { userId: string; activity: string; timestamp: string }) => {
      console.log('👥 User activity:', data);
      options.onUserActivity(data);
      setActiveUsers(prev => {
        const newUsers = [...prev];
        if (!newUsers.includes(data.userId)) {
          newUsers.push(data.userId);
        }
        return newUsers;
      });
    });

    newSocket.on('user_disconnected', (data: { userId: string }) => {
      console.log('👋 User disconnected:', data.userId);
      setActiveUsers(prev => prev.filter(id => id !== data.userId));
    });

    newSocket.on('cell_edited', (data: unknown) => {
      console.log('✏️ Cell edited:', data);
      options.onCellEdited(data);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [options]);

  // Send user activity
  const sendUserActivity = (activity: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('user_activity', { activity });
    }
  };

  // Send cell edit
  const sendCellEdit = (data: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('cell_edit', data);
    }
  };

  return {
    socket,
    isConnected,
    activeUsers,
    sendUserActivity,
    sendCellEdit,
  };
};
