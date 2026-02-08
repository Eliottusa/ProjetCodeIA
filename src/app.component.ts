import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MusicDataService } from './services/music-data.service';
import { RecommendationEngineService } from './services/recommendation-engine.service';
import { Track, TimeOfDay, RecommendationScore } from './models/music.types';
import { TrackCardComponent } from './components/track-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TrackCardComponent],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <header class="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI DJ
          </h1>
          <span class="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">v2.0</span>
        </div>

        <div class="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            @for (time of timeOptions; track time) {
              <button 
                (click)="setTime(time)"
                class="px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2"
                [class.bg-white]="currentTime() === time"
                [class.shadow-sm]="currentTime() === time"
                [class.text-blue-600]="currentTime() === time"
                [class.text-slate-500]="currentTime() !== time"
              >
                <span>{{ getTimeIcon(time) }}</span>
                <span class="hidden sm:inline">{{ time }}</span>
              </button>
            }
          </div>

          <button 
            (click)="toggleDiscoveryMode()"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium"
            [class.bg-indigo-50]="discoveryMode()"
            [class.border-indigo-200]="discoveryMode()"
            [class.text-indigo-700]="discoveryMode()"
            [class.bg-white]="!discoveryMode()"
            [class.border-slate-200]="!discoveryMode()"
            [class.text-slate-600]="!discoveryMode()"
          >
            <span>🔭 Discovery</span>
            <div class="w-8 h-4 bg-slate-200 rounded-full relative transition-colors" [class.bg-indigo-500]="discoveryMode()">
              <div class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform" [class.translate-x-4]="discoveryMode()"></div>
            </div>
          </button>
        </div>
      </header>

      <main class="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Main Content (Player) -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
          @if (currentlyPlaying(); as current) {
            <div class="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative group">
              @if (currentVideoUrl(); as url) {
                <iframe 
                  [src]="url" 
                  class="w-full h-full" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
                </iframe>
              }
            </div>
            
            <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <h2 class="text-2xl font-bold text-slate-900 mb-1">{{ current.title }}</h2>
                  <p class="text-lg text-slate-500 font-medium">{{ current.channel }}</p>
                </div>
                <div class="flex gap-2">
                  <span class="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                    {{ current.derived.genre }}
                  </span>
                  <span class="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                    {{ current.derived.energy }}
                  </span>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                <span class="font-semibold text-slate-700">Tags:</span> {{ current.tags.join(', ') }}
              </div>
            </div>

          } @else {
             <div class="bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl aspect-video flex items-center justify-center text-slate-400 flex-col gap-4">
                <div class="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-3xl">🎵</div>
                <p class="font-medium">Select a track from the recommendation list</p>
             </div>
          }

           <!-- Context Stats -->
           <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
               <div class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Time</div>
               <div class="font-semibold text-slate-700">{{ currentTime() }}</div>
             </div>
             <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
               <div class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Mode</div>
               <div class="font-semibold text-slate-700">{{ discoveryMode() ? 'Discovery' : 'Standard' }}</div>
             </div>
             <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
               <div class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Items</div>
               <div class="font-semibold text-slate-700">{{ allTracks().length }} Tracks</div>
             </div>
             <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
               <div class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Recs</div>
               <div class="font-semibold text-slate-700">{{ recommendations().length }}</div>
             </div>
           </div>
        </div>

        <!-- Sidebar (Recommendations) -->
        <div class="lg:col-span-5 xl:col-span-4 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-slate-800 text-xl flex items-center gap-2">
              <span>Next Up</span>
              <span class="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ recommendations().length }}</span>
            </h3>
          </div>
          
          <div class="space-y-3 h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            @for (item of recommendations(); track item.track.id) {
              <div class="relative group transition-transform hover:scale-[1.01]">
                <app-track-card 
                  [track]="item.track" 
                  [isActive]="currentlyPlaying()?.id === item.track.id"
                  (play)="playTrack($event)"
                ></app-track-card>
                
                <!-- Score & Explanation Tooltip -->
                <div class="absolute top-2 right-2 z-10">
                   <div class="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                     {{ item.score }}
                   </div>
                </div>

                <div class="hidden group-hover:block absolute z-20 left-0 bottom-full w-full bg-slate-800 text-slate-200 text-xs p-3 rounded-lg shadow-xl pointer-events-none mb-2 border border-slate-700">
                  <div class="font-bold mb-2 text-white border-b border-slate-600 pb-1">Why this track?</div>
                  <ul class="space-y-1">
                    @for (exp of item.explanations; track exp) {
                      <li class="flex items-start gap-1.5">
                        <span class="text-blue-400 mt-0.5">▪</span>
                        <span>{{ exp }}</span>
                      </li>
                    }
                  </ul>
                  <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-slate-700"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `,
})
export class AppComponent {
  private dataService = inject(MusicDataService);
  private engine = inject(RecommendationEngineService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  // State
  currentTime = signal<TimeOfDay>('Morning');
  discoveryMode = signal<boolean>(false);
  currentlyPlaying = signal<Track | null>(null);
  
  // Constants for template
  timeOptions: TimeOfDay[] = ['Morning', 'Work', 'Evening'];
  
  // Computed Data
  allTracks = this.dataService.tracks;
  
  // Recommendation Logic
  recommendations = computed<RecommendationScore[]>(() => {
    return this.engine.recommend(
      this.allTracks(),
      this.currentlyPlaying(),
      this.currentTime(),
      this.discoveryMode()
    );
  });

  topRecommendation = computed(() => this.recommendations()[0]);

  // Video Player Logic
  currentVideoUrl = computed<SafeResourceUrl | null>(() => {
    const track = this.currentlyPlaying();
    if (!track) return null;
    // Auto-play enabled
    const url = `https://www.youtube.com/embed/${track.id}?autoplay=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  // Actions
  setTime(time: TimeOfDay) {
    this.currentTime.set(time);
  }

  toggleDiscoveryMode() {
    this.discoveryMode.update(v => !v);
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