/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Edit3,
  RefreshCw
} from 'lucide-react';
import { format, formatDistance, isPast, parseISO } from 'date-fns';
import { reminderService } from '../services/reminderService';
import toast from 'react-hot-toast';

const ReminderPanel = ({ reminders, notes, onRefresh }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [pendingReminders, setPendingReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    noteId: '',
    message: '',
    reminderTime: ''
  });

  useEffect(() => {
    loadPendingReminders();
  }, []);

  const loadPendingReminders = async () => {
    try {
      const pending = await reminderService.getPendingReminders();
      setPendingReminders(pending);
    } catch (error) {
      console.error('Failed to load pending reminders:', error);
    }
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedNote = notes.find(n => n.noteId === parseInt(formData.noteId));
      
      const reminderData = {
        note: { noteId: parseInt(formData.noteId) },
        message: formData.message || `Reminder for: ${selectedNote?.title}`,
        reminderTime: new Date(formData.reminderTime).toISOString(),
        isSent: false
      };

      if (editingReminder) {
        await reminderService.updateReminder(editingReminder.reminderId, reminderData);
        toast.success('Reminder updated successfully!');
      } else {
        await reminderService.createReminder(reminderData);
        toast.success('Reminder created successfully!');
      }

      setShowCreateForm(false);
      setEditingReminder(null);
      setFormData({ noteId: '', message: '', reminderTime: '' });
      onRefresh();
      loadPendingReminders();
    } catch (error) {
      toast.error('Failed to save reminder');
    }
    setIsLoading(false);
  };

  const handleDeleteReminder = async (reminderId) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await reminderService.deleteReminder(reminderId);
        toast.success('Reminder deleted');
        onRefresh();
        loadPendingReminders();
      } catch (error) {
        toast.error('Failed to delete reminder');
      }
    }
  };

  const handleMarkAsSent = async (reminderId) => {
    try {
      await reminderService.markReminderAsSent(reminderId);
      toast.success('Reminder marked as completed');
      onRefresh();
      loadPendingReminders();
    } catch (error) {
      toast.error('Failed to mark reminder as sent');
    }
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      noteId: reminder.note.noteId.toString(),
      message: reminder.message,
      reminderTime: format(parseISO(reminder.reminderTime), "yyyy-MM-dd'T'HH:mm")
    });
    setShowCreateForm(true);
  };

  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingReminder(null);
    setFormData({ noteId: '', message: '', reminderTime: '' });
  };

  const getReminderStatus = (reminder) => {
    const reminderTime = parseISO(reminder.reminderTime);
    const now = new Date();
    
    if (reminder.isSent) {
      return { status: 'completed', color: 'text-green-500', icon: CheckCircle };
    } else if (isPast(reminderTime)) {
      return { status: 'overdue', color: 'text-red-500', icon: AlertCircle };
    } else {
      return { status: 'pending', color: 'text-blue-500', icon: Clock };
    }
  };

  const groupedReminders = reminders.reduce((groups, reminder) => {
    const { status } = getReminderStatus(reminder);
    if (!groups[status]) groups[status] = [];
    groups[status].push(reminder);
    return groups;
  }, {});

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-obsidian-900">
      {/* Header */}
      <div className="border-b border-obsidian-200 dark:border-obsidian-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-primary-500 mr-3" />
            <div>
              <h2 className="text-xl font-semibold">Reminders</h2>
              <p className="text-sm text-obsidian-500">
                {reminders.length} total • {pendingReminders.length} pending
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onRefresh();
                loadPendingReminders();
              }}
              className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Reminder
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-obsidian-50 dark:bg-obsidian-800 rounded-lg p-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <div className="text-sm font-semibold">{groupedReminders.pending?.length || 0}</div>
                <div className="text-xs text-obsidian-500">Pending</div>
              </div>
            </div>
          </div>
          <div className="bg-obsidian-50 dark:bg-obsidian-800 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <div>
                <div className="text-sm font-semibold">{groupedReminders.overdue?.length || 0}</div>
                <div className="text-xs text-obsidian-500">Overdue</div>
              </div>
            </div>
          </div>
          <div className="bg-obsidian-50 dark:bg-obsidian-800 rounded-lg p-3">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <div>
                <div className="text-sm font-semibold">{groupedReminders.completed?.length || 0}</div>
                <div className="text-xs text-obsidian-500">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-obsidian-50 dark:bg-obsidian-800 rounded-lg p-3">
            <div className="flex items-center">
              <Bell className="w-4 h-4 text-primary-500 mr-2" />
              <div>
                <div className="text-sm font-semibold">{reminders.length}</div>
                <div className="text-xs text-obsidian-500">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="border-b border-obsidian-200 dark:border-obsidian-700 p-4 bg-obsidian-50 dark:bg-obsidian-800">
          <h3 className="text-lg font-semibold mb-4">
            {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
          </h3>
          
          <form onSubmit={handleCreateReminder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <select
                  value={formData.noteId}
                  onChange={(e) => setFormData({ ...formData, noteId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-obsidian-300 dark:border-obsidian-600 rounded-lg bg-white dark:bg-obsidian-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a note</option>
                  {notes.map(note => (
                    <option key={note.noteId} value={note.noteId}>
                      {note.title || 'Untitled'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Reminder Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  required
                  min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                  className="w-full px-3 py-2 border border-obsidian-300 dark:border-obsidian-600 rounded-lg bg-white dark:bg-obsidian-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message (Optional)</label>
              <input
                type="text"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Custom reminder message..."
                className="w-full px-3 py-2 border border-obsidian-300 dark:border-obsidian-600 rounded-lg bg-white dark:bg-obsidian-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : editingReminder ? 'Update Reminder' : 'Create Reminder'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="bg-obsidian-500 hover:bg-obsidian-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders List */}
      <div className="flex-1 overflow-y-auto p-4">
        {reminders.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-obsidian-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-obsidian-600 dark:text-obsidian-300 mb-2">
              No Reminders Yet
            </h3>
            <p className="text-obsidian-500 mb-4">
              Create reminders to stay on top of your notes and tasks
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Your First Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedReminders).map(([status, statusReminders]) => (
              <div key={status}>
                <h3 className="text-sm font-semibold text-obsidian-600 dark:text-obsidian-400 mb-3 uppercase tracking-wide">
                  {status} ({statusReminders.length})
                </h3>
                <div className="space-y-3">
                  {statusReminders.map((reminder) => {
                    const { status: reminderStatus, color, icon: StatusIcon } = getReminderStatus(reminder);
                    const reminderTime = parseISO(reminder.reminderTime);
                    
                    return (
                      <div
                        key={reminder.reminderId}
                        className="bg-white dark:bg-obsidian-800 border border-obsidian-200 dark:border-obsidian-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <StatusIcon className={`w-4 h-4 ${color} mr-2`} />
                              <h4 className="font-medium text-sm">
                                {reminder.note?.title || 'Unknown Note'}
                              </h4>
                            </div>
                            
                            <p className="text-sm text-obsidian-600 dark:text-obsidian-400 mb-3">
                              {reminder.message}
                            </p>
                            
                            <div className="flex items-center text-xs text-obsidian-500 space-x-4">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {format(reminderTime, 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {format(reminderTime, 'HH:mm')}
                              </div>
                              <div>
                                {formatDistance(reminderTime, new Date(), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!reminder.isSent && (
                              <button
                                onClick={() => handleMarkAsSent(reminder.reminderId)}
                                className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 transition-colors"
                                title="Mark as completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleEditReminder(reminder)}
                              className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-700 transition-colors"
                              title="Edit reminder"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteReminder(reminder.reminderId)}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                              title="Delete reminder"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderPanel;