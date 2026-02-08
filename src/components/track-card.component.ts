import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../models/music.types';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="group relative flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-all cursor-pointer"
      (click)="play.emit(track())"
    >
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {{ track().title }}
          </h3>
          <p class="text-slate-500 text-sm font-medium">{{ track().channel }}</p>
        </div>
        @if (isActive()) {
          <span class="flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        }
      </div>

      <div class="flex gap-2 mb-3 flex-wrap">
        <span class="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">
          {{ track().derived.genre }}
        </span>
        <span class="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">
          Energy: {{ track().derived.energy }}
        </span>
         <span class="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">
          {{ track().duration }}s
        </span>
      </div>
      
      <div class="mt-auto pt-2 border-t border-slate-50 text-xs text-slate-400 truncate">
        Tags: {{ track().tags.join(', ') }}
      </div>
    </div>
  `
})
export class TrackCardComponent {
  track = input.required<Track>();
  isActive = input<boolean>(false);
  play = output<Track>();
}
