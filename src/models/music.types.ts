export type EnergyLevel = 'Low' | 'Medium' | 'High';
export type TempoLevel = 'Slow' | 'Medium' | 'Fast';
export type Genre = 'Lofi' | 'Rock' | 'Pop' | 'Jazz' | 'Electronic' | 'Classical' | 'Unknown';

export interface DerivedAttributes {
  genre: Genre;
  energy: EnergyLevel;
  tempo: TempoLevel;
}

export interface Track {
  id: string;
  title: string;
  channel: string;
  tags: string[];
  duration: number; // in seconds
  derived: DerivedAttributes;
}

export type TimeOfDay = 'Morning' | 'Work' | 'Evening';

export interface RecommendationScore {
  track: Track;
  score: number;
  explanations: string[];
}
