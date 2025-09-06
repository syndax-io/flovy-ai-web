"use client";

import { useState, useEffect } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  type: "goal" | "note" | "reminder";
  priority: "high" | "medium" | "low";
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesCardProps {
  onNotesUpdate?: (notes: Note[]) => void;
}

export default function NotesCard({ onNotesUpdate }: NotesCardProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState<{
    title: string;
    content: string;
    type: "goal" | "note" | "reminder";
    priority: "high" | "medium" | "low";
  }>({
    title: "",
    content: "",
    type: "note",
    priority: "medium",
  });

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("dashboard-notes");
    if (savedNotes) {
      try {
        // Define a type for the raw note object from localStorage before date conversion
        type RawNoteFromStorage = Omit<Note, "createdAt" | "updatedAt"> & {
          createdAt: string;
          updatedAt: string;
        };

        const parsedNotes = JSON.parse(savedNotes).map(
          (note: RawNoteFromStorage) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          })
        );
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("dashboard-notes", JSON.stringify(notes));
    onNotesUpdate?.(notes);
  }, [notes, onNotesUpdate]);

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      ...newNote,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", type: "note", priority: "medium" });
    setIsAddingNote(false);
  };

  const toggleNoteCompletion = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, completed: !note.completed, updatedAt: new Date() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "🎯";
      case "note":
        return "📝";
      case "reminder":
        return "⏰";
      default:
        return "📝";
    }
  };

  const totalNotes = notes.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notes & Goals
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Store your goals and important notes for AI-powered insights
          </p>
        </div>
        <button
          onClick={() => setIsAddingNote(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Add Note
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {totalNotes}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            Total Notes
          </div>
        </div>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <textarea
                placeholder="Note content..."
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={newNote.type}
                onChange={(e) =>
                  setNewNote({
                    ...newNote,
                    type: e.target.value as "goal" | "note" | "reminder",
                  })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="note">📝 Note</option>
                <option value="goal">🎯 Goal</option>
                <option value="reminder">⏰ Reminder</option>
              </select>
              <select
                value={newNote.priority}
                onChange={(e) =>
                  setNewNote({
                    ...newNote,
                    priority: e.target.value as "high" | "medium" | "low",
                  })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Save Note
              </button>
              <button
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote({
                    title: "",
                    content: "",
                    type: "note",
                    priority: "medium",
                  });
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📝</div>
            <p>No notes yet. Add your first note or goal!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border transition-all ${
                note.completed
                  ? "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-75"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getTypeIcon(note.type)}</span>
                    <h4
                      className={`font-medium ${
                        note.completed
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {note.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                        note.priority
                      )} bg-opacity-20`}
                    >
                      {note.priority}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      note.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {note.content}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{note.type}</span>
                    <span>•</span>
                    <span>{note.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleNoteCompletion(note.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      note.completed
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/20"
                    }`}
                    title={
                      note.completed ? "Mark as incomplete" : "Mark as complete"
                    }
                  >
                    {note.completed ? "✅" : "⭕"}
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
