// services/index.jsx - Central export file for all services
import { AuthService } from './authService';
import { NoteService } from './noteService';
import { ReminderService } from './reminderService';
import { API_CONFIG } from './apiconfig';
import api from './apiconfig';

// Export service instances
export const authService = new AuthService();
export const noteService = new NoteService();
export const reminderService = new ReminderService();

// Export service classes
export { AuthService } from './authService';
export { NoteService } from './noteService';
export { ReminderService } from './reminderService';

// Export configuration and utilities
export { API_CONFIG, getErrorMessage } from './apiconfig';