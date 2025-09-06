import { useState, useEffect } from 'react';

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

interface NotesStats {
  totalNotes: number;
  activeGoals: number;
  completedGoals: number;
  highPriorityItems: number;
  recentNotes: Note[];
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<NotesStats>({
    totalNotes: 0,
    activeGoals: 0,
    completedGoals: 0,
    highPriorityItems: 0,
    recentNotes: [],
  });

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("dashboard-notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: { id: string; title: string; content: string; type: string; priority: string; completed: boolean; createdAt: string; updatedAt: string }) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    }
  }, []);

  // Calculate stats whenever notes change
  useEffect(() => {
    const activeGoals = notes.filter(note => note.type === "goal" && !note.completed).length;
    const completedGoals = notes.filter(note => note.type === "goal" && note.completed).length;
    const highPriorityItems = notes.filter(note => note.priority === "high" && !note.completed).length;
    const recentNotes = notes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);

    setStats({
      totalNotes: notes.length,
      activeGoals,
      completedGoals,
      highPriorityItems,
      recentNotes,
    });
  }, [notes]);

  // Get notes for AI analysis
  const getNotesForAI = () => {
    return {
      activeGoals: notes.filter(note => note.type === "goal" && !note.completed),
      highPriorityNotes: notes.filter(note => note.priority === "high" && !note.completed),
      recentNotes: notes
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 10),
      stats: {
        totalNotes: notes.length,
        activeGoals: stats.activeGoals,
        completedGoals: stats.completedGoals,
        highPriorityItems: stats.highPriorityItems,
      }
    };
  };

  // Get context for AI suggestions based on notes and time
  const getAIContext = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Get goals that might be relevant for current time
    const relevantGoals = notes.filter(note => {
      if (note.type !== "goal" || note.completed) return false;
      
      // Simple logic: high priority goals are always relevant
      if (note.priority === "high") return true;
      
      // Medium priority goals are relevant during work hours (9-17)
      if (note.priority === "medium" && currentHour >= 9 && currentHour <= 17) return true;
      
      return false;
    });

    return {
      timeContext: {
        currentHour,
        isWorkHours: currentHour >= 9 && currentHour <= 17,
        isMorning: currentHour >= 6 && currentHour < 12,
        isAfternoon: currentHour >= 12 && currentHour < 18,
        isEvening: currentHour >= 18 && currentHour < 22,
      },
      relevantGoals,
      highPriorityItems: notes.filter(note => note.priority === "high" && !note.completed),
      recentActivity: notes
        .filter(note => {
          const hoursSinceUpdate = (now.getTime() - note.updatedAt.getTime()) / (1000 * 60 * 60);
          return hoursSinceUpdate <= 24; // Last 24 hours
        })
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    };
  };

  return {
    notes,
    stats,
    getNotesForAI,
    getAIContext,
  };
}
