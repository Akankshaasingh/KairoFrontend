import React, { useState } from 'react';
import { Bell, BellOff, Wifi, WifiOff, TestTube, RefreshCw } from 'lucide-react';
import { useNotifications } from './NotificationProvider';

const NotificationBadge = () => {
  const { 
    connected, 
    notifications, 
    testNotification, 
    triggerPendingReminders, 
    requestNotificationPermission 
  } = useNotifications();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const handleRequestPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-lg transition-colors ${
          connected 
            ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20' 
            : 'text-obsidian-400 hover:bg-obsidian-100 dark:hover:bg-obsidian-700'
        }`}
        title={connected ? 'Notifications Connected' : 'Notifications Disconnected'}
      >
        {connected ? (
          <Bell className="w-5 h-5" />
        ) : (
          <BellOff className="w-5 h-5" />
        )}
        
        {/* Connection Status Indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          connected ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className={`absolute inset-0 rounded-full animate-ping ${
            connected ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
        </div>
        
        {/* Notification Count Badge */}
        {notifications.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
            {notifications.length > 99 ? '99+' : notifications.length}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          ></div>
          
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-obsidian-800 border border-obsidian-200 dark:border-obsidian-700 rounded-lg shadow-lg z-50">
            {/* Header */}
            <div className="p-4 border-b border-obsidian-200 dark:border-obsidian-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {connected ? (
                    <div className="flex items-center text-green-600 text-xs">
                      <Wifi className="w-3 h-3 mr-1" />
                      Connected
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 text-xs">
                      <WifiOff className="w-3 h-3 mr-1" />
                      Offline Mode
                    </div>
                  )}
                </div>
              </div>
              
              {/* Browser Notification Permission */}
              {typeof Notification !== 'undefined' && notificationPermission === 'default' && (
                <button
                  onClick={handleRequestPermission}
                  className="mt-2 w-full text-xs bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded"
                >
                  Enable Browser Notifications
                </button>
              )}
              
              {typeof Notification !== 'undefined' && notificationPermission === 'denied' && (
                <div className="mt-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded">
                  Browser notifications blocked. Enable in browser settings.
                </div>
              )}
            </div>

            {/* Recent Notifications */}
            <div className="max-h-60 overflow-y-auto">
              {recentNotifications.length > 0 ? (
                <div className="divide-y divide-obsidian-100 dark:divide-obsidian-700">
                  {recentNotifications.map((notification, index) => (
                    <div key={notification.timestamp || index} className="p-3 hover:bg-obsidian-50 dark:hover:bg-obsidian-700">
                      <div className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                          notification.type === 'reminder' ? 'bg-red-500' :
                          notification.type === 'test' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-obsidian-900 dark:text-obsidian-100">
                            {notification.title}
                          </p>
                          <p className="text-xs text-obsidian-600 dark:text-obsidian-400 mt-1">
                            {notification.message}
                          </p>
                          {notification.timestamp && (
                            <p className="text-xs text-obsidian-500 mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-obsidian-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-obsidian-200 dark:border-obsidian-700 bg-obsidian-50 dark:bg-obsidian-800/50">
              <div className="flex items-center justify-between space-x-2">
                <button
                  onClick={() => {
                    testNotification();
                    setShowDropdown(false);
                  }}
                  className="flex items-center text-xs text-obsidian-600 dark:text-obsidian-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <TestTube className="w-3 h-3 mr-1" />
                  Test
                </button>
                
                <button
                  onClick={() => {
                    triggerPendingReminders();
                    setShowDropdown(false);
                  }}
                  className="flex items-center text-xs text-obsidian-600 dark:text-obsidian-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Check Reminders
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBadge;