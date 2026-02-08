import { Injectable, computed } from '@angular/core';
import { Track, RecommendationScore, TimeOfDay } from '../models/music.types';

@Injectable({
  providedIn: 'root'
})
export class RecommendationEngineService {

  // Implementation of Specification 3: Recommendation Rules
  recommend(candidates: Track[], lastPlayed: Track | null, timeOfDay: TimeOfDay): RecommendationScore[] {
    return candidates.map(track => {
      let score = 0;
      const explanations: string[] = [];

      // --- Rule 1: Anti-Repetition ---
      if (lastPlayed && track.id === lastPlayed.id) {
        score -= 999;
        explanations.push('Penalized: Recently played');
      }

      // --- Rule 2: Time of Day ---
      if (timeOfDay === 'Morning') {
        if (track.derived.energy === 'Medium') {
          score += 10;
          explanations.push('Boost: Medium energy fits Morning');
        } else if (track.derived.energy === 'High') {
             score -= 5;
             explanations.push('Penalty: Too energetic for Morning');
        }
      } else if (timeOfDay === 'Work') {
        if (track.derived.energy === 'High') {
          score += 10;
          explanations.push('Boost: High energy fits Work');
        } else if (track.derived.energy === 'Medium') {
            score += 5;
            explanations.push('Boost: Medium energy acceptable for Work');
        }
      } else if (timeOfDay === 'Evening') {
        if (track.derived.energy === 'Low') {
          score += 10;
          explanations.push('Boost: Low energy fits Evening');
        } else if (track.derived.energy === 'High') {
          score -= 10;
          explanations.push('Penalty: Too intense for Evening');
        }
      }

      // --- Rule 3: Genre Continuity ---
      if (lastPlayed) {
        if (track.derived.genre === lastPlayed.derived.genre) {
          score += 5;
          explanations.push(`Boost: Matches previous genre (${track.derived.genre})`);
        }
      }

      return { track, score, explanations };
    }).sort((a, b) => b.score - a.score); // Descending sort by score
  }
}
