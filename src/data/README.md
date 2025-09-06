# Notes & Goals Integration

This directory contains the data structures and integration for the Notes & Goals feature in the Flovy AI dashboard.

## Overview

The Notes & Goals feature allows users to:
- Store personal notes, goals, and reminders
- Track progress on goals and tasks
- Provide context to AI for better suggestions
- Sync with calendar data for comprehensive insights

## Files

### `dashboardData.ts`
Contains the dashboard card data including the new "Notes & Goals" card that appears in the main dashboard grid.

### Components

#### `NotesCard` (`src/components/NotesCard/index.tsx`)
A comprehensive note-taking component that provides:
- Add/edit/delete notes and goals
- Priority levels (high, medium, low)
- Note types (goal, note, reminder)
- Completion tracking
- Local storage persistence
- Real-time statistics

#### `useNotes` Hook (`src/hooks/useNotes.ts`)
A custom React hook that provides:
- Notes state management
- Statistics calculation
- AI context generation
- Time-based filtering
- Data export for AI processing

## AI Integration

The notes data is integrated with the AI suggestions system in several ways:

1. **Context-Aware Suggestions**: AI uses notes data along with calendar events to provide personalized suggestions
2. **Time-Based Insights**: AI considers the current time of day and user's active goals
3. **Priority-Based Recommendations**: High-priority items get more attention in AI suggestions
4. **Progress Tracking**: AI can reference completed goals and ongoing tasks

## API Endpoints

### `GET /api/notes`
Returns structured notes data for AI processing.

### `POST /api/notes`
Creates new notes (for future server-side storage).

## Data Flow

1. User creates notes/goals in the NotesCard component
2. Data is stored in localStorage (client-side)
3. useNotes hook provides data to AI suggestions
4. AI processes notes along with calendar data
5. Personalized suggestions are generated and displayed

## Future Enhancements

- Server-side storage with user authentication
- Real-time sync across devices
- Advanced AI analysis of note patterns
- Integration with external goal-tracking services
- Collaborative goal sharing
