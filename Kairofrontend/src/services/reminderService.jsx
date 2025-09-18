import api, { API_CONFIG } from './apiconfig';
import { authService } from './authService';

export class ReminderService {
  async _ensureAuth() {
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
  }

  async getAllReminders() {
    await this._ensureAuth();
    try {
      const response = await api.get(API_CONFIG.endpoints.reminders.getAll);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch reminders');
    }
  }

  async getReminderById(id) {
    await this._ensureAuth();
    try {
      const response = await api.get(API_CONFIG.endpoints.reminders.getById(id));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch reminder');
    }
  }

  async createReminder(reminderData) {
    await this._ensureAuth();
    try {
      const response = await api.post(API_CONFIG.endpoints.reminders.create, reminderData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create reminder');
    }
  }

  async updateReminder(id, reminderData) {
    await this._ensureAuth();
    try {
      const response = await api.put(API_CONFIG.endpoints.reminders.update(id), reminderData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update reminder');
    }
  }

  async deleteReminder(id) {
    await this._ensureAuth();
    try {
      await api.delete(API_CONFIG.endpoints.reminders.delete(id));
    } catch (error) {
      throw new Error('Failed to delete reminder');
    }
  }

  async getPendingReminders() {
    await this._ensureAuth();
    try {
      const response = await api.get(`${API_CONFIG.endpoints.reminders.base}/pending`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch pending reminders');
    }
  }

  async markReminderAsSent(id) {
    await this._ensureAuth();
    try {
      const response = await api.post(`${API_CONFIG.endpoints.reminders.base}/${id}/mark-sent`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to mark reminder as sent');
    }
  }
}

export const reminderService = new ReminderService();