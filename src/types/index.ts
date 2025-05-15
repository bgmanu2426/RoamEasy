
export interface Trip {
  id: string;
  name: string;
  destinations: string[];
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  notes?: string;
  activities?: string[];
  imageUrl?: string; // e.g., from unsplash or a placeholder
  aiSummary?: string;
  budget?: string;
  travelStyle?: string;
  interests?: string;
}

export type TripSuggestion = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
};

// For the AI suggestion form
export interface SuggestionFilters {
  interests: string;
  budget: string;
  travelStyle: string;
  location?: string;
}
