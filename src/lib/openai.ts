import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CalendarEvent {
  title: string;
  startTime: string;
  endTime: string;
}

export interface UserPreferences {
  preferredWorkHours?: string;
  idealEnergyLevels?: string;
  focusTime?: string;
  [key: string]: string | undefined;
}

export interface UserProfile {
  name: string;
  goals: string[];
  recentTasks: string[];
  calendarEvents: CalendarEvent[];
  preferences: UserPreferences;
}

export interface SuggestionResponse {
  suggestion: string;
  reasoning?: string;
  priority?: 'high' | 'medium' | 'low';
}

export async function generateProductivitySuggestion(
  userProfile: UserProfile
): Promise<SuggestionResponse> {
  const systemPrompt = `You're a personal productivity assistant. Based on the user's goals, calendar, and recent progress, suggest what they should focus on today.`;

  const userPrompt = `User Profile:\nName: ${userProfile.name}\n\nGoals: ${userProfile.goals.join(', ')}\n\nRecent Tasks: ${userProfile.recentTasks.join(', ')}\n\nCalendar Events Today:\n${userProfile.calendarEvents.map(event => `- ${event.title} (${event.startTime} - ${event.endTime})`).join('\n')}\n\nPreferences: ${JSON.stringify(userProfile.preferences, null, 2)}\n\nBased on this information, what should ${userProfile.name} focus on today?`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  const suggestion = completion.choices[0]?.message?.content?.trim();
  if (!suggestion) throw new Error('No suggestion generated');
  return { suggestion };
}

export { openai }; 