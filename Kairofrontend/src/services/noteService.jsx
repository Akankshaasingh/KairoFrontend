import api, { API_CONFIG } from './apiconfig';
import axios from 'axios';
import { authService } from './authService';

// Axios instance without interceptors (no Authorization header) for fallback
const unauthAxios = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: { 'Content-Type': 'application/json' }
});

class NoteService {
  // Helper: don't throw on 401 (allow dev mode), return null to indicate auth issue
  handleApiError(error) {
    if (error?.response?.status === 401) {
      console.warn('Authentication failed for notes API, returning safe fallback (null)');
      return null; // caller will interpret null as auth failure
    }
    throw error;
  }

  async _ensureAuth() {
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
  }

  formatNoteForFrontend(note) {
    if (!note) return note;
    return {
      ...note,
      id: note.id ?? note.noteId,
      starred: note.starred ?? note.isStarred,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

  formatNoteForBackend(noteData) {
    return {
      title: noteData.title ?? 'Untitled',
      content: noteData.content ?? '',
      isStarred: Boolean(noteData.starred || noteData.isStarred),
      isEncrypted: !!noteData.isEncrypted,
    };
  }

  async getAllNotes() {
    try {
      // don't block if not authenticated; attempt primary request with possible token
      const res = await api.get(API_CONFIG.endpoints.notes.getAll);
      const notes = Array.isArray(res.data) ? res.data : [];
      return notes.map(n => this.formatNoteForFrontend(n));
    } catch (error) {
      // if server forbids (403) try unauthenticated request as fallback
      if (error?.response?.status === 403) {
        try {
          const res2 = await unauthAxios.get(API_CONFIG.endpoints.notes.getAll);
          const notes2 = Array.isArray(res2.data) ? res2.data : [];
          return notes2.map(n => this.formatNoteForFrontend(n));
        } catch (err2) {
          console.warn('Unauthenticated fallback failed for getAllNotes', err2);
          return [];
        }
      }
      const result = this.handleApiError(error);
      if (result === null) return [];
      throw new Error('Failed to fetch notes');
    }
  }

  async getNoteById(id) {
    try {
      const res = await api.get(API_CONFIG.endpoints.notes.getById(id));
      return this.formatNoteForFrontend(res.data);
    } catch (error) {
      if (error?.response?.status === 403) {
        try {
          const res2 = await unauthAxios.get(API_CONFIG.endpoints.notes.getById(id));
          return this.formatNoteForFrontend(res2.data);
        } catch (err2) {
          console.warn('Unauthenticated fallback failed for getNoteById', err2);
          return null;
        }
      }
      const result = this.handleApiError(error);
      if (result === null) return null;
      throw new Error('Failed to fetch note');
    }
  }

  async createNote(noteData) {
    try {
      const payload = this.formatNoteForBackend(noteData);
      const res = await api.post(API_CONFIG.endpoints.notes.create, payload);
      return this.formatNoteForFrontend(res.data);
    } catch (error) {
      if (error?.response?.status === 403) {
        try {
          const res2 = await unauthAxios.post(API_CONFIG.endpoints.notes.create, this.formatNoteForBackend(noteData));
          return this.formatNoteForFrontend(res2.data);
        } catch (err2) {
          console.warn('Unauthenticated fallback failed for createNote', err2);
          return null;
        }
      }
      const result = this.handleApiError(error);
      if (result === null) return null;
      throw new Error('Failed to create note');
    }
  }

  async updateNote(id, noteData) {
    try {
      const payload = this.formatNoteForBackend(noteData);
      const res = await api.put(API_CONFIG.endpoints.notes.update(id), payload);
      return this.formatNoteForFrontend(res.data);
    } catch (error) {
      if (error?.response?.status === 403) {
        try {
          const res2 = await unauthAxios.put(API_CONFIG.endpoints.notes.update(id), this.formatNoteForBackend(noteData));
          return this.formatNoteForFrontend(res2.data);
        } catch (err2) {
          console.warn('Unauthenticated fallback failed for updateNote', err2);
          return null;
        }
      }
      const result = this.handleApiError(error);
      if (result === null) return null;
      throw new Error('Failed to update note');
    }
  }

  async deleteNote(id) {
    try {
      await api.delete(API_CONFIG.endpoints.notes.delete(id));
      return true;
    } catch (error) {
      if (error?.response?.status === 403) {
        try {
          await unauthAxios.delete(API_CONFIG.endpoints.notes.delete(id));
          return true;
        } catch (err2) {
          console.warn('Unauthenticated fallback failed for deleteNote', err2);
          return false;
        }
      }
      const result = this.handleApiError(error);
      if (result === null) return false;
      throw new Error('Failed to delete note');
    }
  }

  async toggleStar(id) {
    try {
      const res = await api.post(`${API_CONFIG.endpoints.notes.base}/${id}/star`);
      return this.formatNoteForFrontend(res.data);
    } catch (error) {
      if (error?.response?.status === 403) {
        try {
          const res2 = await unauthAxios.post(`${API_CONFIG.endpoints.notes.base}/${id}/star`);
          return this.formatNoteForFrontend(res2.data);
        } catch (err2) {
          console.warn('Unauthenticated fallback failed for toggleStar', err2);
          return null;
        }
      }
      const result = this.handleApiError(error);
      if (result === null) return null;
      throw new Error('Failed to toggle star');
    }
  }

  async searchNotes(q) {
    try {
      if (!q || !q.trim()) return [];
      const res = await api.get(`${API_CONFIG.endpoints.notes.base}/search`, { params: { q } });
      const notes = Array.isArray(res.data) ? res.data : [];
      return notes.map(n => this.formatNoteForFrontend(n));
    } catch (error) {
      if (error?.response?.status === 403) {
        try {
          const res2 = await unauthAxios.get(`${API_CONFIG.endpoints.notes.base}/search`, { params: { q } });
          const notes2 = Array.isArray(res2.data) ? res2.data : [];
          return notes2.map(n => this.formatNoteForFrontend(n));
        } catch (err2) {
          console.warn('Unauthenticated fallback failed for searchNotes', err2);
          return [];
        }
      }
      const result = this.handleApiError(error);
      if (result === null) return [];
      throw new Error('Failed to search notes');
    }
  }
}

export const noteService = new NoteService();
export { NoteService };
export default noteService;