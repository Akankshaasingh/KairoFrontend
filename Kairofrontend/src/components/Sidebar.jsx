// /* eslint-disable no-unused-vars */
// import React, { useState } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Star, 
//   BookOpen, 
//   Share2, 
//   Bell, 
//   Settings, 
//   LogOut, 
//   Moon, 
//   Sun,
//   FileText,
//   Trash2,
//   MoreVertical
// } from 'lucide-react';
// import { formatDistance } from 'date-fns';
// import toast from 'react-hot-toast';

// const Sidebar = ({
//   notes,
//   selectedNote,
//   onNoteSelect,
//   onNoteCreate,
//   onNoteDelete,
//   onToggleStar,
//   onLogout,
//   onViewChange,
//   currentView,
//   onToggleSearch,
//   darkMode,
//   onToggleDarkMode,
//   user
// }) => {
//   const [showNoteMenu, setShowNoteMenu] = useState(null);

//   const handleCreateNote = async () => {
//     try {
//       const newNote = {
//         title: 'Untitled Note',
//         content: '',
//         isStarred: false
//       };
//       await onNoteCreate(newNote);
//       toast.success('New note created!');
//     } catch (error) {
//       toast.error('Failed to create note');
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     if (window.confirm('Are you sure you want to delete this note?')) {
//       try {
//         await onNoteDelete(noteId);
//         toast.success('Note deleted');
//         setShowNoteMenu(null);
//       } catch (error) {
//         toast.error('Failed to delete note');
//       }
//     }
//   };

//   const handleToggleStar = async (noteId, e) => {
//     e.stopPropagation();
//     try {
//       await onToggleStar(noteId);
//     } catch (error) {
//       toast.error('Failed to toggle star');
//     }
//   };

//   const truncateContent = (content, maxLength = 50) => {
//     if (!content) return 'No content...';
//     const text = content.replace(/[#*`_~]/g, '').trim();
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   const menuItems = [
//     { id: 'notes', icon: FileText, label: 'All Notes', count: notes.length },
//     { id: 'starred', icon: Star, label: 'Starred', count: notes.filter(n => n.isStarred).length },
//     { id: 'graph', icon: Share2, label: 'Graph View' },
//     { id: 'reminders', icon: Bell, label: 'Reminders' }
//   ];

//   return (
//     <div className="w-80 bg-obsidian-100 dark:bg-obsidian-800 border-r border-obsidian-200 dark:border-obsidian-700 flex flex-col h-full">
//       {/* Header */}
//       <div className="p-4 border-b border-obsidian-200 dark:border-obsidian-700">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <BookOpen className="w-6 h-6 text-primary-500 mr-2" />
//             <h1 className="text-lg font-bold">Kairo</h1>
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={onToggleDarkMode}
//               className="p-2 rounded-lg hover:bg-obsidian-200 dark:hover:bg-obsidian-700 transition-colors"
//             >
//               {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//             </button>
//             <button
//               onClick={onToggleSearch}
//               className="p-2 rounded-lg hover:bg-obsidian-200 dark:hover:bg-obsidian-700 transition-colors"
//             >
//               <Search className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         <button
//           onClick={handleCreateNote}
//           className="w-full flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           New Note
//         </button>
//       </div>

//       {/* Navigation */}
//       <div className="p-4 border-b border-obsidian-200 dark:border-obsidian-700">
//         <nav className="space-y-1">
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => onViewChange(item.id)}
//               className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
//                 currentView === item.id
//                   ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
//                   : 'hover:bg-obsidian-200 dark:hover:bg-obsidian-700'
//               }`}
//             >
//               <div className="flex items-center">
//                 <item.icon className="w-4 h-4 mr-3" />
//                 {item.label}
//               </div>
//               {item.count !== undefined && (
//                 <span className="text-xs bg-obsidian-300 dark:bg-obsidian-600 px-2 py-1 rounded-full">
//                   {item.count}
//                 </span>
//               )}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Notes List */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-4">
//           <h3 className="text-sm font-semibold text-obsidian-600 dark:text-obsidian-400 mb-3">
//             Recent Notes
//           </h3>
//           <div className="space-y-2">
//             {notes.length === 0 ? (
//               <div className="text-center py-8 text-obsidian-500">
//                 <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                 <p className="text-sm">No notes yet</p>
//                 <p className="text-xs text-obsidian-400 mt-1">Create your first note to get started</p>
//               </div>
//             ) : (
//               notes.slice(0, 10).map((note) => (
//                 <div
//                   key={note.noteId}
//                   className={`relative group p-3 rounded-lg cursor-pointer transition-colors ${
//                     selectedNote?.noteId === note.noteId
//                       ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800'
//                       : 'hover:bg-obsidian-200 dark:hover:bg-obsidian-700'
//                   }`}
//                   onClick={() => onNoteSelect(note)}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-sm truncate mb-1">
//                         {note.title || 'Untitled'}
//                       </h4>
//                       <p className="text-xs text-obsidian-600 dark:text-obsidian-400 mb-2">
//                         {truncateContent(note.content)}
//                       </p>
//                       <div className="flex items-center justify-between text-xs text-obsidian-500">
//                         <span>
//                           {note.updatedAt 
//                             ? formatDistance(new Date(note.updatedAt), new Date(), { addSuffix: true })
//                             : 'Just now'
//                           }
//                         </span>
//                         {note.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
//                       </div>
//                     </div>

//                     <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={(e) => handleToggleStar(note.noteId, e)}
//                         className={`p-1 rounded hover:bg-obsidian-300 dark:hover:bg-obsidian-600 ${
//                           note.isStarred ? 'text-yellow-500' : 'text-obsidian-400'
//                         }`}
//                       >
//                         <Star className={`w-3 h-3 ${note.isStarred ? 'fill-current' : ''}`} />
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setShowNoteMenu(showNoteMenu === note.noteId ? null : note.noteId);
//                         }}
//                         className="p-1 rounded hover:bg-obsidian-300 dark:hover:bg-obsidian-600 text-obsidian-400"
//                       >
//                         <MoreVertical className="w-3 h-3" />
//                       </button>
//                     </div>

//                     {showNoteMenu === note.noteId && (
//                       <div className="absolute right-0 top-8 bg-white dark:bg-obsidian-700 border border-obsidian-200 dark:border-obsidian-600 rounded-lg shadow-lg z-10 py-1 min-w-32">
//                         <button
//                           onClick={() => handleDeleteNote(note.noteId)}
//                           className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
//                         >
//                           <Trash2 className="w-4 h-4 mr-2" />
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* User Profile */}
//       <div className="p-4 border-t border-obsidian-200 dark:border-obsidian-700">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
//               {user?.username?.charAt(0).toUpperCase()}
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium">{user?.username}</p>
//               <p className="text-xs text-obsidian-500">{user?.email}</p>
//             </div>
//           </div>
//           <button
//             onClick={onLogout}
//             className="p-2 rounded-lg hover:bg-obsidian-200 dark:hover:bg-obsidian-700 transition-colors text-obsidian-500"
//             title="Logout"
//           >
//             <LogOut className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  BookOpen, 
  Share2, 
  Bell, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  FileText,
  Trash2,
  MoreVertical,
  Sparkles,
  Zap
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import toast from 'react-hot-toast';

const Sidebar = ({
  notes,
  selectedNote,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onToggleStar,
  onLogout,
  onViewChange,
  currentView,
  onToggleSearch,
  darkMode,
  onToggleDarkMode,
  user
}) => {
  const [showNoteMenu, setShowNoteMenu] = useState(null);

  const handleCreateNote = async () => {
    try {
      const newNote = {
        title: 'Untitled Note',
        content: '',
        isStarred: false
      };
      await onNoteCreate(newNote);
      toast.success('New note created!', {
        iconTheme: {
          primary: '#8b5cf6',
          secondary: '#ffffff',
        },
      });
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await onNoteDelete(noteId);
        toast.success('Note deleted', {
          iconTheme: {
            primary: '#8b5cf6',
            secondary: '#ffffff',
          },
        });
        setShowNoteMenu(null);
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  const handleToggleStar = async (noteId, e) => {
    e.stopPropagation();
    try {
      await onToggleStar(noteId);
    } catch (error) {
      toast.error('Failed to toggle star');
    }
  };

  const truncateContent = (content, maxLength = 50) => {
    if (!content) return 'No content...';
    const text = content.replace(/[#*`_~]/g, '').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const menuItems = [
    { id: 'notes', icon: FileText, label: 'All Notes', count: notes.length },
    { id: 'starred', icon: Star, label: 'Starred', count: notes.filter(n => n.isStarred).length },
    { id: 'graph', icon: Share2, label: 'Graph View' },
    { id: 'reminders', icon: Bell, label: 'Reminders' }
  ];

  return (
    <div className="w-80 sidebar bg-gradient-to-b from-white via-purple-50/50 to-purple-100/50 dark:from-obsidian-800 dark:via-purple-900/20 dark:to-obsidian-900 border-r border-purple-200/50 dark:border-purple-700/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-purple-200/50 dark:border-purple-700/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="relative">
              <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-purple-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Kairo</h1>
              <p className="text-xs text-purple-500 dark:text-purple-400 font-medium">Smart Notes</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 text-purple-600 dark:text-purple-400 hover:scale-110"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggleSearch}
              className="p-2.5 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 text-purple-600 dark:text-purple-400 hover:scale-110"
              title="Search (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={handleCreateNote}
          className="w-full btn-primary flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </button>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-purple-200/50 dark:border-purple-700/30">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`menu-item w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                currentView === item.id
                  ? 'active bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-800/30 dark:to-violet-800/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-600'
                  : 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300'
              }`}
            >
              <div className="flex items-center">
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </div>
              {item.count !== undefined && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  currentView === item.id
                    ? 'bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-purple-300'
                    : 'bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-400'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Recent Notes
            </h3>
            <Zap className="w-4 h-4 text-purple-500 animate-pulse" />
          </div>
          
          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-800/30 dark:to-violet-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-200/50 dark:border-purple-700/30">
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">No notes yet</p>
                <p className="text-xs text-purple-500 dark:text-purple-500">Create your first note to get started</p>
              </div>
            ) : (
              notes.slice(0, 10).map((note) => (
                <div
                  key={note.noteId}
                  className={`note-item relative group p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedNote?.noteId === note.noteId
                      ? 'bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-800/40 dark:to-violet-800/40 border-2 border-purple-300 dark:border-purple-600 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30'
                      : 'hover:bg-purple-50 dark:hover:bg-purple-800/20 border border-purple-100 dark:border-purple-800/50'
                  }`}
                  onClick={() => onNoteSelect(note)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate mb-1">
                        {note.title || 'Untitled'}
                      </h4>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mb-2 line-clamp-2">
                        {truncateContent(note.content)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-purple-500 dark:text-purple-400">
                        <span>
                          {note.updatedAt 
                            ? formatDistance(new Date(note.updatedAt), new Date(), { addSuffix: true })
                            : 'Just now'
                          }
                        </span>
                        {note.isStarred && (
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                      <button
                        onClick={(e) => handleToggleStar(note.noteId, e)}
                        className={`p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/50 transition-colors ${
                          note.isStarred ? 'text-yellow-500' : 'text-purple-400 hover:text-yellow-500'
                        }`}
                        title={note.isStarred ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-3 h-3 ${note.isStarred ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNoteMenu(showNoteMenu === note.noteId ? null : note.noteId);
                        }}
                        className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/50 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </div>

                    {showNoteMenu === note.noteId && (
                      <div className="absolute right-2 top-12 bg-white dark:bg-obsidian-800 border border-purple-200 dark:border-purple-700 rounded-xl shadow-xl z-10 py-2 min-w-32 backdrop-blur-xl">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.noteId);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-purple-200/50 dark:border-purple-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">{user?.username}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 text-purple-500 hover:text-red-500 hover:scale-110"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;