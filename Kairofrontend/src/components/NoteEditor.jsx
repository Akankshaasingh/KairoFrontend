/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Star, 
  Calendar, 
  Link, 
  Bold, 
  Italic, 
  Code, 
  List, 
  Quote,
  Eye,
  Edit3
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistance } from 'date-fns';
import toast from 'react-hot-toast';

const NoteEditor = ({ note, onNoteUpdate, onNoteCreate, notes }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const contentRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setLastSaved(note.updatedAt);
      setHasUnsavedChanges(false);
    } else {
      setTitle('');
      setContent('');
      setLastSaved(null);
      setHasUnsavedChanges(false);
    }
  }, [note]);

  const handleSave = async (autoSave = false) => {
    if (!title.trim() && !content.trim()) return;

    setIsSaving(true);
    try {
      const noteData = {
        title: title.trim() || 'Untitled',
        content: content.trim()
      };

      if (note?.noteId) {
        await onNoteUpdate(note.noteId, noteData);
      } else {
        await onNoteCreate(noteData);
      }

      setLastSaved(new Date().toISOString());
      setHasUnsavedChanges(false);
      
      if (!autoSave) {
        toast.success('Note saved!');
      }
    } catch (error) {
      toast.error('Failed to save note');
    }
    setIsSaving(false);
  };

  const handleContentChange = (value, field) => {
    if (field === 'title') {
      setTitle(value);
    } else {
      setContent(value);
    }
    
    setHasUnsavedChanges(true);
    
    // Auto-save after 2 seconds of inactivity
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      handleSave(true);
    }, 2000);
  };

  const insertMarkdown = (syntax) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    let newText;
    let newCursorPos;

    switch (syntax) {
      case 'bold':
        newText = `**${selectedText}**`;
        newCursorPos = start + (selectedText ? newText.length : 2);
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        newCursorPos = start + (selectedText ? newText.length : 1);
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        newCursorPos = start + (selectedText ? newText.length : 1);
        break;
      case 'link':
        newText = `[${selectedText || 'Link text'}](url)`;
        newCursorPos = start + newText.length - 4;
        break;
      case 'list':
        newText = selectedText ? selectedText.split('\n').map(line => `- ${line}`).join('\n') : '- ';
        newCursorPos = start + newText.length;
        break;
      case 'quote':
        newText = selectedText ? selectedText.split('\n').map(line => `> ${line}`).join('\n') : '> ';
        newCursorPos = start + newText.length;
        break;
      default:
        return;
    }

    const finalContent = beforeText + newText + afterText;
    setContent(finalContent);
    handleContentChange(finalContent, 'content');

    // Restore cursor position
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  };

  const findNoteLinks = (content) => {
    const linkRegex = /\[\[([^\]]+)\]\]/g;
    const matches = [];
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const linkText = match[1];
      const linkedNote = notes.find(n => 
        n.title?.toLowerCase() === linkText.toLowerCase()
      );
      matches.push({ text: linkText, note: linkedNote, fullMatch: match[0] });
    }
    
    return matches;
  };

  const renderContentWithLinks = (content) => {
    const links = findNoteLinks(content);
    let result = content;
    
    links.forEach(link => {
      const replacement = link.note 
        ? `[${link.text}](#note-${link.note.noteId})`
        : link.text;
      result = result.replace(link.fullMatch, replacement);
    });
    
    return result;
  };

  const toolbarButtons = [
    { icon: Bold, action: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, action: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Code, action: 'code', title: 'Code (Ctrl+`)' },
    { icon: Link, action: 'link', title: 'Link (Ctrl+K)' },
    { icon: List, action: 'list', title: 'List' },
    { icon: Quote, action: 'quote', title: 'Quote' }
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            insertMarkdown('bold');
            break;
          case 'i':
            e.preventDefault();
            insertMarkdown('italic');
            break;
          case '`':
            e.preventDefault();
            insertMarkdown('code');
            break;
          case 'k':
            e.preventDefault();
            insertMarkdown('link');
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, title]);

  if (!note && notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-obsidian-50 dark:bg-obsidian-900">
        <div className="text-center">
          <Edit3 className="w-16 h-16 text-obsidian-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-obsidian-600 dark:text-obsidian-300 mb-2">
            Welcome to Kairo
          </h3>
          <p className="text-obsidian-500 mb-4">Create your first note to get started</p>
          <button
            onClick={() => onNoteCreate({ title: 'My First Note', content: '# Welcome to Kairo!\n\nStart writing your thoughts here...' })}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create First Note
          </button>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-obsidian-50 dark:bg-obsidian-900">
        <div className="text-center">
          <Edit3 className="w-12 h-12 text-obsidian-400 mx-auto mb-3" />
          <p className="text-obsidian-500">Select a note to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-obsidian-900">
      {/* Header */}
      <div className="border-b border-obsidian-200 dark:border-obsidian-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded-lg transition-colors ${
                isPreview 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-obsidian-100 dark:bg-obsidian-800 hover:bg-obsidian-200 dark:hover:bg-obsidian-700'
              }`}
              title={isPreview ? 'Edit Mode' : 'Preview Mode'}
            >
              {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            
            <div className="h-6 w-px bg-obsidian-300 dark:bg-obsidian-600"></div>
            
            {toolbarButtons.map((button) => (
              <button
                key={button.action}
                onClick={() => insertMarkdown(button.action)}
                className="p-2 rounded-lg bg-obsidian-100 dark:bg-obsidian-800 hover:bg-obsidian-200 dark:hover:bg-obsidian-700 transition-colors"
                title={button.title}
                disabled={isPreview}
              >
                <button.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-obsidian-500">
              {hasUnsavedChanges ? (
                <span className="text-amber-600 dark:text-amber-400">Unsaved changes</span>
              ) : lastSaved ? (
                <span>Saved {formatDistance(new Date(lastSaved), new Date(), { addSuffix: true })}</span>
              ) : (
                <span>Not saved</span>
              )}
            </div>

            <button
              onClick={() => handleSave()}
              disabled={isSaving || !hasUnsavedChanges}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                hasUnsavedChanges
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-obsidian-100 dark:bg-obsidian-800 text-obsidian-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => handleContentChange(e.target.value, 'title')}
          placeholder="Note title..."
          className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-obsidian-400"
          disabled={isPreview}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto prose prose-obsidian dark:prose-invert">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => {
                    if (props.href?.startsWith('#note-')) {
                      return (
                        <span className="text-primary-500 hover:text-primary-600 cursor-pointer underline">
                          {props.children}
                        </span>
                      );
                    }
                    return <a {...props} className="text-primary-500 hover:text-primary-600" />;
                  }
                }}
              >
                {renderContentWithLinks(content)}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="h-full p-6">
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value, 'content')}
              placeholder="Start writing..."
              className="w-full h-full resize-none bg-transparent border-none outline-none font-mono text-sm leading-relaxed placeholder-obsidian-400"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-obsidian-200 dark:border-obsidian-700 p-3">
        <div className="flex items-center justify-between text-xs text-obsidian-500">
          <div className="flex items-center space-x-4">
            <span>{content.length} characters</span>
            <span>{content.split(/\s+/).filter(word => word.length > 0).length} words</span>
            {note?.createdAt && (
              <span>Created {formatDistance(new Date(note.createdAt), new Date(), { addSuffix: true })}</span>
            )}
          </div>
          
          <div className="text-xs text-obsidian-400">
            Pro tip: Use [[Note Title]] to link to other notes
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;