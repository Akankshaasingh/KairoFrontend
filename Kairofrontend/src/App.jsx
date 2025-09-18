import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import GraphView from './components/GraphView';
import AuthModal from './components/AuthModal';
import ReminderPanel from './components/ReminderPanel';
import SearchModal from './components/SearchModal';
import { NotificationProvider } from './components/NotificationProvider';
import NotificationBadge from './components/NotificationBadge';
import { authService, noteService, reminderService } from './services';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [user, setUser] = useState(authService.getCurrentUser());
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [currentView, setCurrentView] = useState('notes');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        try {
          const [notesData, remindersData] = await Promise.all([
            noteService.getAllNotes(),
            reminderService.getPendingReminders()
          ]);
          setNotes(notesData);
          setReminders(remindersData);
        } catch (error) {
          console.error('Error loading data:', error);
          toast.error('Failed to load data');
        }
      }
    };
    loadData();
  }, [isAuthenticated]);

  // Ensure initialization runs on first mount (clears initial loading spinner)
  useEffect(() => {
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  const loadUserData = async () => {
    try {
      const [notesData, remindersData] = await Promise.all([
        noteService.getAllNotes(),
        reminderService.getPendingReminders()
      ]);
      setNotes(notesData);
      setReminders(remindersData);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load data');
    }
  };

  const initializeApp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const isValid = await authService.validateToken();
        if (isValid) {
          const userData = JSON.parse(localStorage.getItem('user'));
          setUser(userData);
          setIsAuthenticated(true);
          await loadNotes();
          await loadReminders();
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
    setIsLoading(false);
  };

  const loadNotes = async () => {
    try {
      const notesData = await noteService.getAllNotes();
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const loadReminders = async () => {
    try {
      const remindersData = await reminderService.getAllReminders();
      setReminders(remindersData);
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
  };

    const handleLogin = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Welcome back!');
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const handleSignup = async (credentials) => {
    try {
      const response = await authService.signup(credentials);
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
      setIsAuthenticated(true);
      await loadNotes();
      await loadReminders();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setNotes([]);
    setSelectedNote(null);
    setReminders([]);
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setCurrentView('notes');
  };

  const handleNoteCreate = async (noteData) => {
    try {
      const newNote = await noteService.createNote(noteData);
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      await loadReminders(); // Reload reminders as new ones might be created
      return newNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  };

  const handleNoteUpdate = async (noteId, noteData) => {
    try {
      const updatedNote = await noteService.updateNote(noteId, noteData);
      setNotes(notes.map(note => 
        note.noteId === noteId ? updatedNote : note
      ));
      setSelectedNote(updatedNote);
      return updatedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  };

  const handleNoteDelete = async (noteId) => {
    try {
      await noteService.deleteNote(noteId);
      setNotes(notes.filter(note => note.noteId !== noteId));
      if (selectedNote?.noteId === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };

  const handleToggleStar = async (noteId) => {
    try {
      const updatedNote = await noteService.toggleStar(noteId);
      setNotes(notes.map(note => 
        note.noteId === noteId ? updatedNote : note
      ));
      if (selectedNote?.noteId === noteId) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error('Failed to toggle star:', error);
      throw error;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowSearch(true);
            break;
          case 'n':
            e.preventDefault();
            if (isAuthenticated) {
              handleNoteCreate({ title: 'New Note', content: '' });
            }
            break;
        }
      }
      
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-50 dark:bg-obsidian-900">
        <div className="text-center">
          <div className="spinner spinner-lg mb-4"></div>
          <p className="text-obsidian-500">Loading Kairo...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {!isAuthenticated ? (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <AuthModal onLogin={handleLogin} onSignup={handleSignup} />
          </div>
        ) : (
        <NotificationProvider user={user}>
          <div className="min-h-screen flex bg-obsidian-50 dark:bg-obsidian-900">
            <Sidebar
              notes={notes}
              selectedNote={selectedNote}
              onNoteSelect={handleNoteSelect}
              onNoteCreate={handleNoteCreate}
              onNoteDelete={handleNoteDelete}
              onToggleStar={handleToggleStar}
              onLogout={handleLogout}
              onViewChange={setCurrentView}
              currentView={currentView}
              onToggleSearch={() => setShowSearch(true)}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              user={user}
            />

            <main className="flex-1 flex">
              {currentView === 'notes' && (
                <NoteEditor
                  note={selectedNote}
                  onNoteUpdate={handleNoteUpdate}
                  onNoteCreate={handleNoteCreate}
                  notes={notes}
                />
              )}
              {currentView === 'graph' && (
                <GraphView
                  notes={notes}
                  onNoteSelect={handleNoteSelect}
                />
              )}
              {currentView === 'reminders' && (
                <ReminderPanel
                  reminders={reminders}
                  notes={notes}
                  onRefresh={loadReminders}
                />
              )}
            </main>

            {/* Notification Badge - Fixed Position */}
            <div className="fixed top-4 right-4 z-50">
              <NotificationBadge />
            </div>

            {showSearch && (
              <SearchModal
                notes={notes}
                onClose={() => setShowSearch(false)}
                onNoteSelect={handleNoteSelect}
              />
            )}

            <Toaster 
              position="bottom-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
                style: {
                  background: darkMode ? '#1e293b' : '#ffffff',
                  color: darkMode ? '#f1f5f9' : '#0f172a',
                }
              }}
            />
          </div>
        </NotificationProvider>
        )}
      </div>
    </Router>
  );
}

export default App;