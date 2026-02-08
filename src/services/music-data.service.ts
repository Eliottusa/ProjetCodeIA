import { Injectable, signal, computed } from '@angular/core';
import { Track, DerivedAttributes, Genre, EnergyLevel, TempoLevel } from '../models/music.types';

@Injectable({
  providedIn: 'root'
})
export class MusicDataService {
  // Simulating a database of raw metadata with REAL YouTube IDs
  private rawTracks = [
    { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio', channel: 'Lofi Girl', tags: ['lofi', 'chill', 'sleep', 'instrumental'], duration: 180 },
    { id: 'wOMwO5T3y7c', title: 'Synthwave Mix 2024', channel: 'SynthWave Central', tags: ['electronic', 'upbeat', 'drive', 'retro'], duration: 240 },
    { id: 'pUZeSYsU0Uk', title: 'Best Rock Songs', channel: 'Rock Legends', tags: ['rock', 'workout', 'metal', 'power'], duration: 210 },
    { id: 'NeXMjuQRZL0', title: 'Morning Jazz', channel: 'Cafe Music', tags: ['jazz', 'relax', 'morning', 'piano'], duration: 300 },
    { id: '5qap5aO4i9A', title: 'Code & Chill', channel: 'Lofi Girl', tags: ['lofi', 'focus', 'coding', 'ambient'], duration: 600 },
    { id: 'fLexgOxsZu0', title: 'Top Pop 2024', channel: 'Top Charts', tags: ['pop', 'dance', 'party', 'summer'], duration: 190 },
    { id: '4Tr0otuiQuU', title: 'Moonlight Sonata', channel: 'Classic FM', tags: ['classical', 'piano', 'night', 'sleep'], duration: 900 },
    { id: 'Q04ILDXe3QE', title: 'Cyberpunk City', channel: 'Dark Synth', tags: ['electronic', 'fast', 'intense', 'gaming'], duration: 150 },
    { id: '-FlxM_0S2lA', title: 'Study With Me', channel: 'Lofi Girl', tags: ['lofi', 'study', 'calm'], duration: 400 },
    { id: 'Nco_kh8xJDs', title: 'Hard Rock Training', channel: 'Rock Legends', tags: ['rock', 'classic', 'guitar'], duration: 245 },
    { id: '3s7c1zF6pZk', title: 'Smooth Jazz Club', channel: 'Jazz Club', tags: ['jazz', 'romantic', 'dinner'], duration: 320 },
    { id: 'l7TxwBhtTUY', title: 'Deep Sleep Music', channel: 'Mindful', tags: ['ambient', 'sleep', 'meditation'], duration: 1200 },
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