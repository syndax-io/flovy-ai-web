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

// Mock suggestions for testing without API calls
const mockSuggestions = [
  "Focus on completing your most important task first thing this morning when your energy is highest.",
  "Based on your calendar, you have several meetings today. Prepare key talking points for each one in advance.",
  "Take advantage of the gaps between meetings to work on your personal goals and projects.",
  "Since you have a busy schedule today, try to batch similar tasks together to minimize context switching.",
  "Use the Pomodoro technique to maintain focus during your deep work sessions.",
  "Review your goals for the week and identify the one task that would make the biggest impact if completed today.",
  "Schedule some buffer time between meetings to allow for unexpected discussions or follow-ups.",
  "Consider delegating some of your administrative tasks to free up time for high-value work.",
  "Take regular breaks throughout the day to maintain your energy and focus levels.",
  "End your day by planning tomorrow's priorities based on what you accomplished today."
];

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
    // Return mock suggestion if no API key
    const randomSuggestion = mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
    return { 
      suggestion: randomSuggestion,
      priority: 'medium',
      isMock: true
    };
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
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        console.log('Invalid OpenAI API key, using mock suggestion');
      } else if (error.message.includes('404')) {
        console.log('OpenAI model not available, using mock suggestion');
      } else if (error.message.includes('429') || error.message.includes('quota')) {
        console.log('OpenAI quota exceeded, using mock suggestion');
      } else {
        console.log('OpenAI API error, using mock suggestion');
      }
    }
    
    // Return mock suggestion for any error
    const randomSuggestion = mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
    return { 
      suggestion: randomSuggestion,
      priority: 'medium',
      isMock: true
    };
  }
}

async function generateGeminiSuggestion(systemPrompt: string, userPrompt: string): Promise<SuggestionResponse> {
  // Check if API key is available
  if (!process.env.GEMINI_API_KEY) {
    // Return mock suggestion if no API key
    console.log('No Gemini API key, using mock suggestion');
    const randomSuggestion = mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
    return { 
      suggestion: randomSuggestion,
      priority: 'medium',
      isMock: true
    };
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
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        console.log('Invalid Gemini API key, using mock suggestion');
      } else if (error.message.includes('404')) {
        console.log('Gemini model not available, using mock suggestion');
      } else if (error.message.includes('429') || error.message.includes('quota')) {
        console.log('Gemini quota exceeded, using mock suggestion');
      } else {
        console.log('Gemini API error, using mock suggestion');
      }
    }
    
    // Return mock suggestion for any error
    const randomSuggestion = mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
    return { 
      suggestion: randomSuggestion,
      priority: 'medium',
      isMock: true
    };
  }
}

export { openai }; 