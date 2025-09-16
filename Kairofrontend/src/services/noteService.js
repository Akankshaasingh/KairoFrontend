/* eslint-disable no-unused-vars */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class NoteService {
  async getAllNotes() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch notes');
    }
  }

  async getNoteById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch note');
    }
  }

  async createNote(noteData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/notes`, noteData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create note');
    }
  }

  async updateNote(id, noteData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/notes/${id}`, noteData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update note');
    }
  }

  async deleteNote(id) {
    try {
      await axios.delete(`${API_BASE_URL}/api/notes/${id}`);
    } catch (error) {
      throw new Error('Failed to delete note');
    }
  }

  async getStarredNotes() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes/starred`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch starred notes');
    }
  }

  async searchNotes(query) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search notes');
    }
  }

  async toggleStar(id) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/notes/${id}/star`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to toggle star');
    }
  }
}

export const noteService = new NoteService();