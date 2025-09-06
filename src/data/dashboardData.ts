export interface CardData {
  id: string;
  variant: "blue" | "green" | "purple" | "red" | "yellow";
  title: string;
  description: string;
  summary: {
    mainMetric: string;
    subMetrics: string[];
    trend: "up" | "down" | "stable";
  };
  notes: string[];
  detailedData: {
    charts?: string[];
    metrics: { label: string; value: string; change?: string }[];
    recommendations: string[];
  };
}

export const cardData: CardData[] = [
  {
    id: "daily-focus",
    variant: "blue",
    title: "Daily Focus",
    description: "AI-powered suggestions for what to focus on today",
    summary: {
      mainMetric: "85%",
      subMetrics: ["3 Priority Tasks", "2 Hours Deep Work", "5 Meetings"],
      trend: "up" as const,
    },
    notes: [
      "Based on your calendar and priorities, focus on completing the quarterly report today",
      "You have 3 meetings scheduled - prepare key talking points for each",
      "Block 2 hours for deep work on the new feature development",
      "Review and respond to urgent emails from the last 24 hours",
    ],
    detailedData: {
      metrics: [
        { label: "Focus Score", value: "85%", change: "+5%" },
        { label: "Tasks Completed", value: "12/15", change: "+2" },
        { label: "Deep Work Hours", value: "2.5h", change: "+0.5h" },
        { label: "Meeting Efficiency", value: "92%", change: "+3%" },
      ],
      recommendations: [
        "Schedule your most important task between 9-11 AM when you're most productive",
        "Take a 5-minute break every 25 minutes to maintain focus",
        "Use the Pomodoro technique for the quarterly report task",
        "Prepare talking points for the 2 PM client meeting in advance",
      ],
    },
  },
  {
    id: "habit-tracking",
    variant: "green",
    title: "Habit Tracking",
    description: "Monitor your progress and build better habits",
    summary: {
      mainMetric: "78%",
      subMetrics: ["7 Day Streak", "5/7 Exercise", "30min Reading"],
      trend: "up" as const,
    },
    notes: [
      "Morning routine: 7 days streak - keep it up!",
      "Exercise: 5/7 days this week - aim for 6 days next week",
      "Reading: 30 minutes daily - currently on track",
      "Water intake: 8 glasses daily - need to improve hydration",
      "Sleep: 7-8 hours - maintain this healthy pattern",
    ],
    detailedData: {
      metrics: [
        { label: "Overall Consistency", value: "78%", change: "+8%" },
        { label: "Morning Routine", value: "7 days", change: "streak" },
        { label: "Exercise Days", value: "5/7", change: "+1" },
        { label: "Reading Time", value: "30min", change: "on track" },
        { label: "Water Intake", value: "6/8 glasses", change: "-2" },
        { label: "Sleep Quality", value: "8.2/10", change: "+0.3" },
      ],
      recommendations: [
        "Set a reminder for water intake every 2 hours",
        "Try adding 10 minutes of stretching to your morning routine",
        "Join the evening reading challenge to boost consistency",
        "Track your sleep with a sleep app for better insights",
      ],
    },
  },
  {
    id: "smart-insights",
    variant: "purple",
    title: "Smart Insights",
    description: "Get intelligent insights about your productivity patterns",
    summary: {
      mainMetric: "92%",
      subMetrics: ["Peak Hours 9-11AM", "40% More Tasks", "15% Break Boost"],
      trend: "stable" as const,
    },
    notes: [
      "Your most productive hours are 9-11 AM - schedule important tasks then",
      "You tend to get distracted during 2-4 PM - use this time for routine tasks",
      "Team collaboration peaks on Tuesdays and Thursdays",
      "You complete 40% more tasks when working in 25-minute focused sessions",
      "Consider taking more breaks - productivity increases by 15% with regular rest periods",
    ],
    detailedData: {
      metrics: [
        { label: "Productivity Score", value: "92%", change: "+2%" },
        { label: "Peak Hours", value: "9-11 AM", change: "consistent" },
        { label: "Focus Sessions", value: "25min optimal", change: "proven" },
        { label: "Break Efficiency", value: "15% boost", change: "+5%" },
        { label: "Team Sync Days", value: "Tue/Thu", change: "optimal" },
        { label: "Distraction Hours", value: "2-4 PM", change: "identified" },
      ],
      recommendations: [
        "Move your most challenging tasks to 9-11 AM time slot",
        "Schedule routine tasks and meetings during 2-4 PM",
        "Implement 25-minute focused work sessions with 5-minute breaks",
        "Plan team collaborations for Tuesdays and Thursdays",
        "Use the 2-4 PM slot for creative brainstorming or learning",
      ],
    },
  },
  {
    id: "time-analytics",
    variant: "yellow",
    title: "Time Analytics",
    description: "Detailed breakdown of how you spend your time",
    summary: {
      mainMetric: "6.8h",
      subMetrics: ["2.5h Deep Work", "1.8h Meetings", "2.5h Admin"],
      trend: "up" as const,
    },
    notes: [
      "Total productive time: 6.8 hours out of 8 hours workday",
      "Deep work sessions increased by 15% this week",
      "Meeting efficiency improved with better preparation",
      "Administrative tasks taking up more time than ideal",
      "Consider batching similar tasks to reduce context switching",
    ],
    detailedData: {
      metrics: [
        { label: "Total Productive Time", value: "6.8h", change: "+0.5h" },
        { label: "Deep Work", value: "2.5h", change: "+0.3h" },
        { label: "Meetings", value: "1.8h", change: "-0.2h" },
        { label: "Administrative", value: "2.5h", change: "+0.4h" },
        { label: "Context Switches", value: "12/day", change: "-3" },
        { label: "Focus Score", value: "85%", change: "+5%" },
      ],
      recommendations: [
        "Batch administrative tasks into 30-minute blocks",
        "Reduce meeting duration by 15 minutes when possible",
        "Schedule deep work blocks in 90-minute sessions",
        "Use time blocking to minimize context switching",
        "Review and optimize recurring meetings",
      ],
    },
  },
  {
    id: "goal-progress",
    variant: "red",
    title: "Goal Progress",
    description: "Track progress towards your weekly and monthly goals",
    summary: {
      mainMetric: "73%",
      subMetrics: ["3/5 Weekly Goals", "12/20 Monthly Tasks", "2 Milestones"],
      trend: "up" as const,
    },
    notes: [
      "Weekly goal completion: 3 out of 5 goals achieved",
      "Monthly task progress: 12 out of 20 tasks completed",
      "2 major milestones reached this month",
      "Behind schedule on the project documentation",
      "Ahead of schedule on the team training initiative",
    ],
    detailedData: {
      metrics: [
        { label: "Weekly Goals", value: "3/5", change: "+1" },
        { label: "Monthly Tasks", value: "12/20", change: "+3" },
        { label: "Milestones", value: "2/3", change: "+1" },
        { label: "Project Progress", value: "68%", change: "+8%" },
        { label: "Team Training", value: "85%", change: "+15%" },
        { label: "Documentation", value: "45%", change: "-5%" },
      ],
      recommendations: [
        "Focus on completing the remaining 2 weekly goals",
        "Allocate 2 hours daily for project documentation",
        "Continue the momentum on team training initiative",
        "Review and adjust monthly goals if needed",
        "Celebrate the 2 milestone achievements",
      ],
    },
  },
  {
    id: "notes-goals",
    variant: "blue",
    title: "Notes & Goals",
    description: "Store your goals and important notes for AI-powered insights",
    summary: {
      mainMetric: "12",
      subMetrics: ["5 Active Goals", "7 Notes", "3 Completed"],
      trend: "up" as const,
    },
    notes: [
      "Use this space to jot down your daily goals and important thoughts",
      "AI will analyze your notes along with calendar data for better insights",
      "Set both short-term and long-term goals to track progress",
      "Add context about meetings, projects, or personal objectives",
    ],
    detailedData: {
      metrics: [
        { label: "Total Notes", value: "12", change: "+3" },
        { label: "Active Goals", value: "5", change: "+1" },
        { label: "Completed Goals", value: "3", change: "+2" },
        { label: "AI Insights", value: "8 generated", change: "+2" },
        { label: "Calendar Sync", value: "100%", change: "active" },
        { label: "Goal Progress", value: "60%", change: "+10%" },
      ],
      recommendations: [
        "Write specific, measurable goals with clear deadlines",
        "Review and update your notes weekly for better AI insights",
        "Link your goals to calendar events for better time management",
        "Use the AI suggestions to break down complex goals into smaller tasks",
        "Set reminders to review and update your progress regularly",
      ],
    },
  },
];
