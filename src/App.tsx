import React, { useState, useEffect } from 'react';
import { FileText, Menu, Moon, Plus, Search, Sun } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [{
      id: '1',
      title: 'Welcome to abhi-ns Notes',
      content: 'Start writing your thoughts...',
      date: new Date().toLocaleDateString()
    }];
  });

  const [selectedNote, setSelectedNote] = useState<Note>(() => {
    const savedSelectedNoteId = localStorage.getItem('selectedNoteId');
    return savedSelectedNoteId 
      ? notes.find(note => note.id === savedSelectedNoteId) || notes[0]
      : notes[0];
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    return savedSidebarState ? JSON.parse(savedSidebarState) : true;
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('selectedNoteId', selectedNote.id);
  }, [selectedNote.id]);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      date: new Date().toLocaleDateString()
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
  };

  const updateNote = (content: string) => {
    const updatedNotes = notes.map(note =>
      note.id === selectedNote.id ? { ...note, content } : note
    );
    setNotes(updatedNotes);
    setSelectedNote({ ...selectedNote, content });
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} ${darkMode ? 'bg-zinc-800 border-zinc-600' : 'bg-gray-100 border-black'} border-r-4 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className={`p-4 ${darkMode ? 'border-zinc-600' : 'border-black'} border-b-4`}>
          <div className="flex items-center justify-between mb-4">
            <FileText className={darkMode ? 'text-white' : 'text-black'} />
            <button 
              onClick={() => setSidebarOpen(false)} 
              className={`${darkMode ? 'hover:bg-zinc-700 text-white' : 'hover:bg-black hover:text-white'} p-1 transition-colors`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className={`flex items-center ${darkMode ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-black'} border-2 p-2`}>
            <Search className={`w-5 h-5 mr-2 ${darkMode ? 'text-white' : 'text-black'}`} />
            <input
              type="text"
              placeholder="Search notes..."
              className={`bg-transparent outline-none w-full ${darkMode ? 'text-white placeholder-zinc-400' : 'text-black placeholder-gray-500'}`}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-4 cursor-pointer border-b-2 ${darkMode ? 'border-zinc-600 hover:bg-zinc-700' : 'border-black hover:bg-black hover:text-white'} transition-colors ${
                selectedNote.id === note.id 
                  ? darkMode 
                    ? 'bg-zinc-700 text-white' 
                    : 'bg-black text-white'
                  : darkMode
                    ? 'text-white'
                    : ''
              }`}
            >
              <h3 className="font-mono font-bold">{note.title}</h3>
              <p className="text-sm font-mono mt-1">{note.date}</p>
            </div>
          ))}
        </div>
        <button
          onClick={addNote}
          className={`p-4 font-mono font-bold transition-colors flex items-center justify-center ${
            darkMode 
              ? 'bg-zinc-700 text-white hover:bg-zinc-600 border-zinc-600' 
              : 'bg-black text-white hover:bg-white hover:text-black border-black'
          } border-t-2`}
        >
          <Plus className="w-5 h-5 mr-2" /> New Note
        </button>
      </div>

   
      <div className="flex-1 flex flex-col">
        <div className={`p-4 border-b-4 flex items-center justify-between ${
          darkMode 
            ? 'bg-zinc-800 border-zinc-600 text-white' 
            : 'bg-gray-100 border-black'
        }`}>
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)} 
              className={`${darkMode ? 'hover:bg-zinc-700' : 'hover:bg-black hover:text-white'} p-1 transition-colors`}
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <input
            type="text"
            value={selectedNote.title}
            onChange={(e) => {
              const updatedNotes = notes.map(note =>
                note.id === selectedNote.id ? { ...note, title: e.target.value } : note
              );
              setNotes(updatedNotes);
              setSelectedNote({ ...selectedNote, title: e.target.value });
            }}
            className={`font-mono text-xl font-bold bg-transparent outline-none flex-1 mx-4 ${
              darkMode ? 'text-white' : 'text-black'
            }`}
          />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 ${
              darkMode 
                ? 'hover:bg-zinc-700 text-white' 
                : 'hover:bg-black hover:text-white'
            } transition-colors rounded-md`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex-1 p-4">
          <textarea
            value={selectedNote.content}
            onChange={(e) => updateNote(e.target.value)}
            className={`w-full h-full p-4 font-mono text-lg resize-none outline-none border-2 focus:border-4 transition-colors ${
              darkMode 
                ? 'bg-zinc-800 text-white border-zinc-600 focus:border-zinc-500' 
                : 'bg-white text-black border-black'
            }`}
            placeholder="Start typing..."
          />
        </div>
      </div>
    </div>
  );
}

export default App;