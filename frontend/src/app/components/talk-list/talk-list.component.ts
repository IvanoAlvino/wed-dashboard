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
  template: `
    <div class="talk-list-container">
      <div class="header-section">
        <h1>WeAreDevelopers Conference Talks</h1>
        <button mat-raised-button color="accent" class="popular-talks-btn" (click)="goToPopularTalks()">
          <mat-icon>trending_up</mat-icon>
          View Popular Talks
        </button>
      </div>
      
      <!-- Search Section -->
      <div *ngIf="!loading && talksByDate" class="search-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search talks by title...</mat-label>
          <input matInput [formControl]="searchControl">
          <mat-icon matPrefix>search</mat-icon>
          <button *ngIf="searchTerm" matSuffix mat-icon-button (click)="clearSearch()" type="button">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
        
        <div *ngIf="searchTerm" class="search-results-info">
          Found {{ getTotalFilteredTalks() }} talks matching "{{ searchTerm }}"
        </div>
        
        <div *ngIf="searchTerm && getTotalFilteredTalks() === 0" class="no-results">
          <mat-icon>search_off</mat-icon>
          <p>No talks found matching "{{ searchTerm }}"</p>
          <button mat-button (click)="clearSearch()">Clear search</button>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner></mat-spinner>
        <p>Loading talks...</p>
      </div>
      
      <div *ngIf="!loading && talksByDate" class="conference-schedule">
        <div *ngFor="let dayData of getDayEntries(); let i = index" class="day-group">
          <div class="day-header" (click)="toggleDay(dayData.dayName)" [class.expanded]="expandedDays.has(dayData.dayName)">
            <div class="day-header-content">
              <mat-icon class="expand-icon">{{ expandedDays.has(dayData.dayName) ? 'expand_less' : 'expand_more' }}</mat-icon>
              <h2>{{ dayData.dayName }}</h2>
              <span class="talk-count">({{ dayData.talks.length }} talks)</span>
              <span class="day-date">{{ formatDate(dayData.date) }}</span>
            </div>
          </div>
          
          <div class="talks-list" *ngIf="expandedDays.has(dayData.dayName)" [@slideInOut]>
            <div *ngFor="let talk of dayData.talks; let odd = odd" 
                 class="talk-row" 
                 [class.odd]="odd"
                 [class.expanded]="expandedTalks.has(talk.id)">
              
              <div class="talk-main-info">
                <div class="talk-time">{{ formatTime(talk.startTime) }}</div>
                <div class="talk-details">
                  <div class="talk-title" [innerHTML]="highlightMatch(talk.title, searchTerm)"></div>
                  <div class="talk-speaker">by {{ talk.speaker }}</div>
                </div>
                <div class="talk-meta-inline">
                  <span *ngIf="talk.track" class="track-chip">{{ talk.track }}</span>
                  <span *ngIf="talk.room" class="room-chip">
                    <mat-icon>location_on</mat-icon>{{ talk.room }}
                  </span>
                </div>
                <div class="talk-actions">
                  <div class="rating-inline">
                    <div *ngIf="talk.averageRating" class="average-rating">
                      <mat-icon>star</mat-icon>
                      {{ talk.averageRating | number:'1.1-1' }}
                      <span class="rating-count">({{ talk.ratingCount }})</span>
                    </div>
                    <div *ngIf="isLoggedIn()" class="user-rating-inline">
                      <app-star-rating 
                        [rating]="talk.userRating || 0"
                        [interactive]="true"
                        [size]="'small'"
                        (ratingChange)="onRatingChange(talk, $event)">
                      </app-star-rating>
                    </div>
                  </div>
                  <button *ngIf="talk.description" 
                          class="read-more-btn" 
                          (click)="toggleDescription(talk.id); $event.stopPropagation()">
                    {{ expandedTalks.has(talk.id) ? 'Read less' : 'Read more' }}
                  </button>
                  <button *ngIf="talk.recordingUrl" 
                          class="recording-btn" 
                          (click)="openRecording(talk.recordingUrl); $event.stopPropagation()">
                    <mat-icon>play_circle_filled</mat-icon>
                    Watch
                  </button>
                </div>
              </div>
              
              <div *ngIf="expandedTalks.has(talk.id) && talk.description" 
                   class="talk-description" 
                   [@expandDescription]>
                <p>{{ talk.description }}</p>
                <div *ngIf="!isLoggedIn()" class="login-prompt">
                  <span>Login to rate this talk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .talk-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .header-section h1 {
      margin: 0;
      color: #1976d2;
      font-size: 2em;
      font-weight: 500;
    }
    
    .popular-talks-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    
    .popular-talks-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .search-section {
      margin-bottom: 24px;
      
      .search-field {
        width: 100%;
      }
      
      .search-results-info {
        margin-top: 8px;
        color: #666;
        font-size: 0.9em;
        font-style: italic;
      }
      
      .no-results {
        text-align: center;
        padding: 40px 20px;
        color: #666;
        
        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
        p {
          margin: 0 0 16px 0;
          font-size: 1.1em;
        }
      }
    }
    
    .search-highlight {
      background-color: #ffeb3b;
      font-weight: 600;
      padding: 1px 2px;
      border-radius: 2px;
      color: #333;
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      gap: 16px;
    }
    
    .conference-schedule {
      margin-top: 24px;
    }
    
    .day-group {
      margin-bottom: 24px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .day-header {
      background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
      color: white;
      padding: 16px 24px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      user-select: none;
    }
    
    .day-header:hover {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    }
    
    .day-header.expanded {
      box-shadow: inset 0 -2px 4px rgba(0,0,0,0.1);
    }
    
    .day-header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .expand-icon {
      transition: transform 0.2s ease-in-out;
    }
    
    .day-header h2 {
      margin: 0;
      font-weight: 500;
      font-size: 1.4em;
    }
    
    .talk-count {
      font-size: 0.9em;
      opacity: 0.9;
    }
    
    .day-date {
      margin-left: auto;
      font-size: 0.9em;
      opacity: 0.9;
    }
    
    .talks-list {
      background: #fafafa;
    }
    
    .talk-row {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      transition: all 0.2s ease-in-out;
    }
    
    .talk-row:last-child {
      border-bottom: none;
    }
    
    .talk-row.odd {
      background: #f8f9fa;
    }
    
    .talk-row:hover {
      background: #e3f2fd;
      transform: translateX(2px);
    }
    
    .talk-main-info {
      display: grid;
      grid-template-columns: 80px 1fr auto auto;
      gap: 16px;
      padding: 16px 24px;
      align-items: center;
    }
    
    .talk-time {
      font-weight: 600;
      color: #1976d2;
      font-size: 0.95em;
      text-align: center;
      padding: 4px 8px;
      background: #e3f2fd;
      border-radius: 4px;
    }
    
    .talk-details {
      min-width: 0;
    }
    
    .talk-title {
      font-weight: 600;
      font-size: 1.05em;
      color: #212121;
      margin-bottom: 4px;
      line-height: 1.3;
    }
    
    .talk-speaker {
      color: #666;
      font-size: 0.9em;
    }
    
    .talk-meta-inline {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .track-chip {
      background: #e8f5e8;
      color: #2e7d32;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: 500;
    }
    
    .room-chip {
      background: #fff3e0;
      color: #f57c00;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .room-chip mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    
    .talk-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .rating-inline {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
    }
    
    .average-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85em;
      color: #ff9800;
      font-weight: 500;
    }
    
    .average-rating mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .rating-count {
      font-size: 0.75em;
      color: #999;
    }
    
    .user-rating-inline {
      margin-top: 2px;
    }
    
    .read-more-btn {
      background: none;
      border: 1px solid #2196f3;
      color: #2196f3;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8em;
      transition: all 0.2s ease-in-out;
    }
    
    .read-more-btn:hover {
      background: #2196f3;
      color: white;
    }
    
    .recording-btn {
      background: #ff5722;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8em;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease-in-out;
    }
    
    .recording-btn:hover {
      background: #e64a19;
      transform: translateY(-1px);
    }
    
    .recording-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .talk-description {
      padding: 16px 24px;
      background: #f5f5f5;
      border-top: 1px solid #e0e0e0;
    }
    
    .talk-description p {
      margin: 0 0 12px 0;
      line-height: 1.5;
      color: #424242;
    }
    
    .login-prompt {
      font-size: 0.85em;
      color: #666;
      font-style: italic;
      margin-top: 8px;
    }
    
    @media (max-width: 768px) {
      .talk-main-info {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .talk-actions {
        justify-content: space-between;
      }
      
      .talk-meta-inline {
        justify-content: flex-start;
      }
    }
  `]
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
