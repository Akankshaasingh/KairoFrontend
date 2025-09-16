/* eslint-disable no-unused-vars */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ReminderService {
  async getAllReminders() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reminders`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch reminders');
    }
  }

  async getReminderById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reminders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch reminder');
    }
  }

  async createReminder(reminderData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/reminders`, reminderData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create reminder');
    }
  }

  async updateReminder(id, reminderData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/reminders/${id}`, reminderData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update reminder');
    }
  }

  async deleteReminder(id) {
    try {
      await axios.delete(`${API_BASE_URL}/api/reminders/${id}`);
    } catch (error) {
      throw new Error('Failed to delete reminder');
    }
  }

  async getPendingReminders() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reminders/pending`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch pending reminders');
    }
  }

  async markReminderAsSent(id) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/reminders/${id}/mark-sent`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to mark reminder as sent');
    }
  }
}

export const reminderService = new ReminderService();