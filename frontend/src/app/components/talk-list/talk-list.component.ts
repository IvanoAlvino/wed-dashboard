import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TalkService } from '../../services/talk.service';
import { AuthService } from '../../services/auth.service';
import { Talk, TalksByDate } from '../../models/talk.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-talk-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    StarRatingComponent
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-in-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ height: '0', opacity: 0, overflow: 'hidden' }))
      ])
    ]),
    trigger('expandDescription', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('200ms ease-in-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ height: '0', opacity: 0, overflow: 'hidden' }))
      ])
    ])
  ],
  templateUrl: './talk-list.component.html',
  styleUrls: ['./talk-list.component.scss']
})
export class TalkListComponent implements OnInit {
  talksByDate: TalksByDate | null = null;
  filteredTalksByDate: TalksByDate | null = null;
  loading = true;
  expandedDays: Set<string> = new Set(['Day 1', 'Day 2', 'Day 3']); // All expanded by default
  expandedTalks: Set<number> = new Set();
  dayEntries: { dayName: string; date: string; talks: Talk[] }[] = [];
  
  // Search functionality
  searchControl = new FormControl('');
  searchTerm: string = '';

  constructor(
    private talkService: TalkService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTalks();
    this.setupSearch();
  }

  loadTalks(): void {
    this.loading = true;
    this.talkService.getAllTalks().subscribe({
      next: (data) => {
        this.talksByDate = data;
        this.applySearch(); // Apply current search after loading
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load talks', 'Close', { duration: 5000 });
      }
    });
  }

  private buildDayEntries(): { dayName: string; date: string; talks: Talk[] }[] {
    if (!this.talksByDate) {
      return [];
    }
    
    const sortedDates = Object.keys(this.talksByDate).sort();
    
    return sortedDates.map((date, index) => ({
      dayName: `Day ${index + 1}`,
      date,
      talks: this.talksByDate![date].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      )
    }));
  }

  getDayEntries(): { dayName: string; date: string; talks: Talk[] }[] {
    return this.dayEntries;
  }

  toggleDay(dayName: string): void {
    if (this.expandedDays.has(dayName)) {
      this.expandedDays.delete(dayName);
    } else {
      this.expandedDays.add(dayName);
    }
  }

  toggleDescription(talkId: number): void {
    if (this.expandedTalks.has(talkId)) {
      this.expandedTalks.delete(talkId);
    } else {
      this.expandedTalks.add(talkId);
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(timeStr: string): string {
    return timeStr.substring(0, 5); // HH:MM format
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onRatingChange(talk: Talk, rating: number): void {
    if (!this.isLoggedIn()) {
      this.snackBar.open('Please login to rate talks', 'Close', { duration: 3000 });
      return;
    }

    const ratingRequest = {
      talkId: talk.id,
      rating: rating
    };

    this.talkService.rateTalk(ratingRequest).subscribe({
      next: () => {
        talk.userRating = rating;
        this.snackBar.open('Rating saved!', 'Close', { duration: 2000 });
        // Optionally reload talks to get updated average rating
        this.loadTalks();
      },
      error: (error) => {
        this.snackBar.open('Failed to save rating', 'Close', { duration: 3000 });
      }
    });
  }

  openRecording(recordingUrl: string): void {
    window.open(recordingUrl, '_blank');
  }

  // Search functionality methods
  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.searchTerm = searchTerm || '';
        this.applySearch();
      });
  }

  private applySearch(): void {
    if (!this.talksByDate) {
      return;
    }

    this.filteredTalksByDate = this.filterTalks(this.searchTerm);
    this.dayEntries = this.buildDayEntriesFromFiltered();
  }

  private filterTalks(searchTerm: string): TalksByDate {
    if (!searchTerm.trim()) {
      return this.talksByDate || {};
    }

    const filtered: TalksByDate = {};
    const normalizedSearch = searchTerm.toLowerCase();

    Object.keys(this.talksByDate || {}).forEach(date => {
      const matchingTalks = this.talksByDate![date].filter(talk =>
        talk.title.toLowerCase().includes(normalizedSearch)
      );
      if (matchingTalks.length > 0) {
        filtered[date] = matchingTalks;
      }
    });

    return filtered;
  }

  private buildDayEntriesFromFiltered(): { dayName: string; date: string; talks: Talk[] }[] {
    const dataToUse = this.filteredTalksByDate || this.talksByDate;
    if (!dataToUse) {
      return [];
    }

    const sortedDates = Object.keys(dataToUse).sort();

    return sortedDates.map((date, index) => ({
      dayName: `Day ${index + 1}`,
      date,
      talks: dataToUse[date].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      )
    }));
  }

  highlightMatch(text: string, searchTerm: string): string {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  getTotalFilteredTalks(): number {
    const dataToUse = this.filteredTalksByDate || this.talksByDate;
    if (!dataToUse) return 0;

    return Object.values(dataToUse).reduce((total, talks) => total + talks.length, 0);
  }

  goToPopularTalks(): void {
    this.router.navigate(['/popular']);
  }

  // Helper method to expose Object.keys to template
  Object = Object;
}
