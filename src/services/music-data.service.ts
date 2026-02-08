import { Injectable, signal, computed } from '@angular/core';
import { Track, DerivedAttributes, Genre, EnergyLevel, TempoLevel } from '../models/music.types';

@Injectable({
  providedIn: 'root'
})
export class MusicDataService {
  // Simulating a database of raw metadata
  private rawTracks = [
    { id: '1', title: 'Rainy Night Coffee', channel: 'Lofi Girl', tags: ['lofi', 'chill', 'sleep', 'instrumental'], duration: 180 },
    { id: '2', title: 'Neon Highway', channel: 'SynthWave Central', tags: ['electronic', 'upbeat', 'drive', 'retro'], duration: 240 },
    { id: '3', title: 'Heavy Lifting', channel: 'Gym Rats', tags: ['rock', 'workout', 'metal', 'power'], duration: 210 },
    { id: '4', title: 'Morning Jazz Vibes', channel: 'Cafe Music', tags: ['jazz', 'relax', 'morning', 'piano'], duration: 300 },
    { id: '5', title: 'Code Focus', channel: 'Dev Tunes', tags: ['electronic', 'focus', 'coding', 'ambient'], duration: 600 },
    { id: '6', title: 'Summer Pop Hits', channel: 'Top Charts', tags: ['pop', 'dance', 'party', 'summer'], duration: 190 },
    { id: '7', title: 'Moonlight Sonata', channel: 'Classic FM', tags: ['classical', 'piano', 'night', 'sleep'], duration: 900 },
    { id: '8', title: 'Cyberpunk Chase', channel: 'Dark Synth', tags: ['electronic', 'fast', 'intense', 'gaming'], duration: 150 },
    { id: '9', title: 'Study With Me', channel: 'Academia', tags: ['lofi', 'study', 'calm'], duration: 400 },
    { id: '10', title: 'Hard Rock Anthem', channel: 'Rock Legends', tags: ['rock', 'classic', 'guitar'], duration: 245 },
    { id: '11', title: 'Smooth Saxophone', channel: 'Jazz Club', tags: ['jazz', 'romantic', 'dinner'], duration: 320 },
    { id: '12', title: 'Deep Sleep Beta Waves', channel: 'Mindful', tags: ['ambient', 'sleep', 'meditation'], duration: 1200 },
  ];

  readonly tracks = signal<Track[]>([]);

  constructor() {
    this.processTracks();
  }

  private processTracks() {
    const processed = this.rawTracks.map(raw => {
      const derived = this.deriveAttributes(raw.tags, raw.duration);
      return { ...raw, derived };
    });
    this.tracks.set(processed);
  }

  // Implementation of Specification 2: Attribute Derivation Rules
  private deriveAttributes(tags: string[], duration: number): DerivedAttributes {
    const lowerTags = tags.map(t => t.toLowerCase());

    // 1. Derive Genre
    let genre: Genre = 'Unknown';
    if (lowerTags.some(t => t.includes('lofi'))) genre = 'Lofi';
    else if (lowerTags.some(t => t.includes('rock') || t.includes('metal'))) genre = 'Rock';
    else if (lowerTags.some(t => t.includes('pop'))) genre = 'Pop';
    else if (lowerTags.some(t => t.includes('jazz'))) genre = 'Jazz';
    else if (lowerTags.some(t => t.includes('electronic') || t.includes('synth'))) genre = 'Electronic';
    else if (lowerTags.some(t => t.includes('classical'))) genre = 'Classical';

    // 2. Derive Energy
    let energy: EnergyLevel = 'Medium';
    const lowKeywords = ['chill', 'relax', 'sleep', 'ambient', 'lofi', 'calm', 'meditation'];
    const highKeywords = ['metal', 'rock', 'workout', 'upbeat', 'dance', 'intense', 'power'];

    if (lowerTags.some(t => lowKeywords.includes(t))) {
      energy = 'Low';
    } else if (lowerTags.some(t => highKeywords.includes(t))) {
      energy = 'High';
    }

    // 3. Derive Tempo
    let tempo: TempoLevel = 'Medium';
    if (energy === 'Low') {
      tempo = 'Slow';
    } else if (energy === 'High' && duration < 180) {
      tempo = 'Fast';
    }

    return { genre, energy, tempo };
  }
}
