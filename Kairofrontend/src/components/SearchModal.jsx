import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Star, Calendar } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { noteService } from '../services/noteService';

const SearchModal = ({ notes, onClose, onNoteSelect }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef();
  const resultsRef = useRef();

  useEffect(() => {
    // Focus search input when modal opens
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // Handle escape key to close modal
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const searchNotes = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      
      try {
        // Use API search for remote search
        const apiResults = await noteService.searchNotes(query);
        
        // Also do local search for immediate results
        const localResults = notes.filter(note => {
          const titleMatch = note.title?.toLowerCase().includes(query.toLowerCase());
          const contentMatch = note.content?.toLowerCase().includes(query.toLowerCase());
          return titleMatch || contentMatch;
        });

        // Combine and deduplicate results
        const combinedResults = [...apiResults];
        localResults.forEach(localNote => {
          if (!combinedResults.find(apiNote => apiNote.noteId === localNote.noteId)) {
            combinedResults.push(localNote);
          }
        });

        // Sort by relevance (title matches first, then by update time)
        const sortedResults = combinedResults.sort((a, b) => {
          const aTitle = a.title?.toLowerCase() || '';
          const bTitle = b.title?.toLowerCase() || '';
          const queryLower = query.toLowerCase();
          
          const aTitleMatch = aTitle.includes(queryLower);
          const bTitleMatch = bTitle.includes(queryLower);
          
          if (aTitleMatch && !bTitleMatch) return -1;
          if (!aTitleMatch && bTitleMatch) return 1;
          
          // If both or neither match title, sort by update time
          const aTime = new Date(a.updatedAt || 0);
          const bTime = new Date(b.updatedAt || 0);
          return bTime - aTime;
        });

        setSearchResults(sortedResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search failed:', error);
        // Fallback to local search only
        const localResults = notes.filter(note => {
          const titleMatch = note.title?.toLowerCase().includes(query.toLowerCase());
          const contentMatch = note.content?.toLowerCase().includes(query.toLowerCase());
          return titleMatch || contentMatch;
        });
        setSearchResults(localResults);
      }
      
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(searchNotes, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, notes]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          handleSelectNote(searchResults[selectedIndex]);
        }
        break;
    }
  };

  const handleSelectNote = (note) => {
    onNoteSelect(note);
    onClose();
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getContentPreview = (content, query) => {
    if (!content) return 'No content...';
    
    const queryIndex = content.toLowerCase().indexOf(query.toLowerCase());
    if (queryIndex === -1) {
      return content.substring(0, 100) + (content.length > 100 ? '...' : '');
    }
    
    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content.length, queryIndex + query.length + 50);
    const preview = content.substring(start, end);
    
    return (start > 0 ? '...' : '') + preview + (end < content.length ? '...' : '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white dark:bg-obsidian-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-obsidian-200 dark:border-obsidian-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-obsidian-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search notes..."
              className="w-full pl-10 pr-10 py-3 bg-obsidian-100 dark:bg-obsidian-700 border border-obsidian-300 dark:border-obsidian-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-obsidian-400 hover:text-obsidian-600 dark:hover:text-obsidian-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {query && (
            <div className="mt-2 text-sm text-obsidian-500">
              {isSearching ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Searching...
                </div>
              ) : (
                `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} found`
              )}
            </div>
          )}
        </div>

        {/* Search Results */}
        <div ref={resultsRef} className="overflow-y-auto max-h-80">
          {!query ? (
            <div className="p-8 text-center text-obsidian-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg mb-2">Search your notes</p>
              <div className="text-sm space-y-1">
                <p>• Search by title or content</p>
                <p>• Use ↑↓ arrows to navigate</p>
                <p>• Press Enter to select</p>
                <p>• Press Esc to close</p>
              </div>
            </div>
          ) : searchResults.length === 0 && !isSearching ? (
            <div className="p-8 text-center text-obsidian-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg mb-2">No notes found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((note, index) => (
                <div
                  key={note.noteId}
                  onClick={() => handleSelectNote(note)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-primary-100 dark:bg-primary-900/30 border-r-2 border-primary-500' 
                      : 'hover:bg-obsidian-100 dark:hover:bg-obsidian-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <FileText className="w-4 h-4 text-obsidian-400 mr-2 flex-shrink-0" />
                        <h3 className="font-medium text-sm truncate">
                          {highlightText(note.title || 'Untitled', query)}
                        </h3>
                        {note.isStarred && (
                          <Star className="w-3 h-3 text-yellow-500 ml-2 fill-current flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-xs text-obsidian-600 dark:text-obsidian-400 mb-2 line-clamp-2">
                        {highlightText(getContentPreview(note.content, query), query)}
                      </p>
                      
                      <div className="flex items-center text-xs text-obsidian-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {note.updatedAt 
                          ? formatDistance(new Date(note.updatedAt), new Date(), { addSuffix: true })
                          : 'Recently created'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-obsidian-200 dark:border-obsidian-700 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-obsidian-500">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>⏎ Select</span>
              <span>⎋ Close</span>
            </div>
            <div>
              Press <kbd className="px-1.5 py-0.5 bg-obsidian-200 dark:bg-obsidian-600 rounded text-xs">Ctrl+K</kbd> to search anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;