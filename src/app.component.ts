import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicDataService } from './services/music-data.service';
import { RecommendationEngineService } from './services/recommendation-engine.service';
import { Track, TimeOfDay, RecommendationScore } from './models/music.types';
import { TrackCardComponent } from './components/track-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TrackCardComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private dataService = inject(MusicDataService);
  private engine = inject(RecommendationEngineService);

  // State
  currentTime = signal<TimeOfDay>('Morning');
  currentlyPlaying = signal<Track | null>(null);
  
  // Computed Data
  allTracks = this.dataService.tracks;
  
  // Recommendation Logic
  recommendations = computed<RecommendationScore[]>(() => {
    return this.engine.recommend(
      this.allTracks(),
      this.currentlyPlaying(),
      this.currentTime()
    );
  });

  topRecommendation = computed(() => this.recommendations()[0]);

  // Actions
  setTime(time: TimeOfDay) {
    this.currentTime.set(time);
  }

  playTrack(track: Track) {
    this.currentlyPlaying.set(track);
  }

  // Helpers for UI
  getTimeIcon(time: TimeOfDay): string {
    switch(time) {
      case 'Morning': return '🌅';
      case 'Work': return '💼';
      case 'Evening': return '🌙';
    }
  }
}
