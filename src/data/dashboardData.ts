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

export const cardData: CardData[] = [];
