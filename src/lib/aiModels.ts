import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

// Model selection enum
export enum AIModel {
  OPENAI = 'openai',
  GEMINI = 'gemini'
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Gemini client
const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
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
  isMock?: boolean;
}


export async function generateProductivitySuggestion(
  userProfile: UserProfile,
  model: AIModel = AIModel.GEMINI // Default to Gemini for now
): Promise<SuggestionResponse> {
  const systemPrompt = `You're a personal productivity assistant. Based on the user's goals, calendar, and recent progress, suggest what they should focus on today. Format your response using markdown for better readability - use **bold** for emphasis, bullet points for lists, and proper headings if needed. Use relevant emojis throughout your response to make it more engaging and visually appealing. Provide detailed, actionable advice.`;
  const userPrompt = `User Profile:\nName: ${userProfile.name}\n\nGoals: ${userProfile.goals.join(', ')}\n\nRecent Tasks: ${userProfile.recentTasks.join(', ')}\n\nCalendar Events Today:\n${userProfile.calendarEvents.map(event => `- ${event.title} (${event.startTime} - ${event.endTime})`).join('\n')}\n\nPreferences: ${JSON.stringify(userProfile.preferences, null, 2)}\n\nBased on this information, what should ${userProfile.name} focus on today?`;

  if (model === AIModel.GEMINI) {
    return await generateGeminiSuggestion(systemPrompt, userPrompt);
  } else {
    return await generateOpenAISuggestion(systemPrompt, userPrompt);
  }
}

async function generateOpenAISuggestion(systemPrompt: string, userPrompt: string): Promise<SuggestionResponse> {
  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  console.log("OPENAI_API_KEY", process.env.OPENAI_API_KEY);
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use GPT-3.5-turbo which is more widely available
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 800, // Increased for fuller suggestions
      temperature: 0.7,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim();
    if (!suggestion) throw new Error('No suggestion generated');
    return { suggestion };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Re-throw the error to be handled by the calling function
    throw error;
  }
}

async function generateGeminiSuggestion(systemPrompt: string, userPrompt: string): Promise<SuggestionResponse> {
  // Check if API key is available
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await gemini.models.generateContent({
      model: 'gemini-2.0-flash-001', // Using the latest Gemini model
      contents: `${systemPrompt}\n\n${userPrompt}`,
      config: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const suggestion = response.text?.trim();
    if (!suggestion) throw new Error('No suggestion generated');
    return { suggestion };
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Re-throw the error to be handled by the calling function
    throw error;
  }
}

export { openai }; 