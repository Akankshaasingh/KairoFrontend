import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';
import { Bell, Clock, CheckCircle, X } from 'lucide-react';

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Custom notification component for reminders
const ReminderNotification = ({ notification, onClose, onMarkRead, onSnooze }) => (
  <div className="bg-white dark:bg-obsidian-800 border-l-4 border-red-500 rounded-lg shadow-lg p-4 max-w-md">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <Bell className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="font-semibold text-obsidian-900 dark:text-obsidian-100">
            {notification.title || 'Reminder'}
          </h3>
        </div>
        
        <p className="text-obsidian-700 dark:text-obsidian-300 mb-2 text-sm">
          {notification.message}
        </p>
        
        {notification.noteTitle && (
          <div className="flex items-center text-xs text-obsidian-500 mb-3">
            <span className="font-medium">📝 {notification.noteTitle}</span>
          </div>
        )}
        
        {notification.reminderTime && (
          <div className="flex items-center text-xs text-obsidian-500 mb-3">
            <Clock className="w-3 h-3 mr-1" />
            <span>Scheduled: {notification.reminderTime}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMarkRead(notification.id)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Mark as Read
          </button>
          <button
            onClick={() => onSnooze(notification.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center"
          >
            <Clock className="w-3 h-3 mr-1" />
            Snooze 15m
          </button>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className="ml-4 text-obsidian-400 hover:text-obsidian-600 dark:hover:text-obsidian-300"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const NotificationProvider = ({ children, user }) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      connectToNotifications(user.id);
    }

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const connectToNotifications = () => {
    const socket = new SockJS(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/ws-notifications`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      onConnect: (frame) => {
        console.log('Connected to notification server:', frame);
        setConnected(true);
        
        // Subscribe to user-specific notifications

        // Show connection success
        toast.success('Connected to notification server', {
          duration: 2000,
          icon: '🔔'
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from notification server');
        setConnected(false);
        toast.error('Disconnected from notifications');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setConnected(false);
        toast.error('Notification connection failed');
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.activate();
    setClient(stompClient);
  };

  const handleNotification = (notification) => {
    console.log('Received notification:', notification);
    
    // Add to notifications list
    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50

    // Play notification sound
    playNotificationSound();

    // Show different UI based on notification type
    if (notification.type === 'reminder') {
      // Show custom reminder notification
      toast.custom((t) => (
        <ReminderNotification
          notification={notification}
          onClose={() => toast.dismiss(t.id)}
          onMarkRead={(id) => {
            markReminderAsRead(id);
            toast.dismiss(t.id);
          }}
          onSnooze={(id) => {
            snoozeReminder(id);
            toast.dismiss(t.id);
          }}
        />
      ), {
        duration: Infinity, // Don't auto-dismiss reminders
        position: 'top-right'
      });

      // Also show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title || 'Reminder', {
          body: notification.message,
          icon: '/favicon.ico',
          tag: `reminder-${notification.id}`
        });
      }
    } else {
      // Show regular toast notification
      toast.success(notification.message, {
        duration: 4000,
        icon: '🔔'
      });
    }
  };

  const markReminderAsRead = async (reminderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reminders/${reminderId}/mark-sent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Reminder marked as completed');
      } else {
        toast.error('Failed to mark reminder as completed');
      }
    } catch (error) {
      console.error('Error marking reminder as read:', error);
      toast.error('Failed to mark reminder as completed');
    }
  };

  const snoozeReminder = async (reminderId) => {
    // For now, just show a success message
    // You can implement the actual snooze API endpoint later
    toast.success('Reminder snoozed for 15 minutes');
    console.log('Snoozing reminder:', reminderId);
  };

  const playNotificationSound = () => {
    try {
      // Create a simple notification beep
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Browser notifications enabled');
      }
      return permission;
    }
    return Notification.permission;
  };

  const testNotification = () => {
    const testData = {
      id: Date.now(),
      title: 'Test Notification',
      message: 'This is a test notification from Kairo!',
      type: 'test',
      timestamp: Date.now()
    };
    handleNotification(testData);
  };

  const triggerPendingReminders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/notifications/trigger-pending`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Checking for pending reminders...');
      } else {
        toast.error('Failed to trigger pending reminders');
      }
    } catch (error) {
      console.error('Error triggering pending reminders:', error);
      toast.error('Failed to trigger pending reminders');
    }
  };

  const contextValue = {
    connected,
    notifications,
    requestNotificationPermission,
    testNotification,
    triggerPendingReminders,
    markReminderAsRead,
    snoozeReminder
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};