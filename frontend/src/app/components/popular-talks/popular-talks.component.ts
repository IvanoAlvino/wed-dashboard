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
import { Talk } from '../../models/talk.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-popular-talks',
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
    <div class="popular-talks-container">
      <div class="header-section">
        <div>
          <button mat-button class="back-button" (click)="goToSchedule()">
            <mat-icon>arrow_back</mat-icon>
            Back to Schedule
          </button>
          <h1>Most Popular Talks</h1>
          <p class="subtitle">Talks ranked by rating and popularity</p>
        </div>
      </div>
      
      <!-- Search Section -->
      <div *ngIf="!loading && talks.length > 0" class="search-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search popular talks by title...</mat-label>
          <input matInput [formControl]="searchControl">
          <mat-icon matPrefix>search</mat-icon>
          <button *ngIf="searchTerm" matSuffix mat-icon-button (click)="clearSearch()" type="button">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
        
        <div *ngIf="searchTerm" class="search-results-info">
          Found {{ filteredTalks.length }} talks matching "{{ searchTerm }}"
        </div>
        
        <div *ngIf="searchTerm && filteredTalks.length === 0" class="no-results">
          <mat-icon>search_off</mat-icon>
          <p>No talks found matching "{{ searchTerm }}"</p>
          <button mat-button (click)="clearSearch()">Clear search</button>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner></mat-spinner>
        <p>Loading popular talks...</p>
      </div>
      
      <div *ngIf="!loading && talks.length === 0" class="no-popular-talks">
        <mat-icon>star_border</mat-icon>
        <h2>No Popular Talks Yet</h2>
        <p>No talks have received ratings yet. Be the first to rate some talks!</p>
        <button mat-raised-button color="primary" (click)="goToSchedule()">
          Go to Schedule
        </button>
      </div>
      
      <div *ngIf="!loading && talks.length > 0" class="popular-talks-list">
        <div *ngFor="let talk of getDisplayTalks(); let i = index" 
             class="talk-item" 
             [class.expanded]="expandedTalks.has(talk.id)">
          
          <div class="talk-main-info">
            <div class="rank-number">{{ i + 1 }}</div>
            <div class="talk-time">{{ formatTime(talk.startTime) }}</div>
            <div class="talk-details">
              <div class="talk-title" [innerHTML]="highlightMatch(talk.title, searchTerm)"></div>
              <div class="talk-speaker">by {{ talk.speaker }}</div>
              <div class="talk-date">{{ formatDate(talk.date) }}</div>
            </div>
            <div class="talk-meta-inline">
              <span *ngIf="talk.track" class="track-chip">{{ talk.track }}</span>
              <span *ngIf="talk.room" class="room-chip">
                <mat-icon>location_on</mat-icon>{{ talk.room }}
              </span>
            </div>
            <div class="talk-actions">
              <div class="rating-section">
                <div class="average-rating">
                  <mat-icon>star</mat-icon>
                  {{ talk.averageRating | number:'1.1-1' }}
                  <span class="rating-count">({{ talk.ratingCount }} votes)</span>
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
              <div class="action-buttons">
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
  `,
  styles: [`
    .popular-talks-container {
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
    
    .back-button {
      color: #2196f3;
      padding: 0;
    }
    
    h1 {
      margin: 0 0 8px 0;
      color: #1976d2;
      font-size: 2.2em;
      font-weight: 500;
    }
    
    .subtitle {
      margin: 0;
      color: #666;
      font-size: 1.1em;
      font-style: italic;
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
    
    .no-popular-talks {
      text-align: center;
      padding: 60px 20px;
      color: #666;
      
      mat-icon {
        font-size: 72px;
        width: 72px;
        height: 72px;
        margin-bottom: 24px;
        opacity: 0.3;
      }
      
      h2 {
        margin: 0 0 16px 0;
        font-size: 1.8em;
        color: #424242;
      }
      
      p {
        margin: 0 0 32px 0;
        font-size: 1.1em;
        line-height: 1.5;
      }
    }
    
    .popular-talks-list {
      margin-top: 24px;
    }
    
    .talk-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: all 0.2s ease-in-out;
      overflow: hidden;
    }
    
    .talk-main-info {
      display: grid;
      grid-template-columns: 40px 80px 1fr auto auto;
      gap: 16px;
      padding: 20px 24px;
      align-items: center;
    }
    
    .rank-number {
      font-size: 1.4em;
      font-weight: 700;
      color: #ff9800;
      text-align: center;
      background: #fff3e0;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
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
      font-size: 1.1em;
      color: #212121;
      margin-bottom: 4px;
      line-height: 1.3;
    }
    
    .talk-speaker {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 2px;
    }
    
    .talk-date {
      color: #999;
      font-size: 0.8em;
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
      flex-direction: column;
      gap: 12px;
      align-items: flex-end;
    }
    
    .rating-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }
    
    .average-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 1em;
      color: #ff9800;
      font-weight: 600;
      background: #fff8e1;
      padding: 6px 12px;
      border-radius: 16px;
    }
    
    .average-rating mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .rating-count {
      font-size: 0.8em;
      color: #f57c00;
      margin-left: 4px;
    }
    
    .user-rating-inline {
      margin-top: 4px;
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
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
      padding: 20px 24px;
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
      .back-button {
        position: relative;
        left: 0;
        top: 0;
        margin-bottom: 16px;
      }
      
      .talk-main-info {
        grid-template-columns: 1fr;
        gap: 12px;
        text-align: center;
      }
      
      .talk-actions {
        align-items: center;
      }
      
      .action-buttons {
        justify-content: center;
      }
      
      .talk-meta-inline {
        justify-content: center;
      }
    }
  `]
})
export class PopularTalksComponent implements OnInit {
  talks: Talk[] = [];
  filteredTalks: Talk[] = [];
  loading = true;
  expandedTalks: Set<number> = new Set();
  
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
    this.loadPopularTalks();
    this.setupSearch();
  }

  loadPopularTalks(): void {
    this.loading = true;
    this.talkService.getPopularTalks().subscribe({
      next: (data) => {
        this.talks = data;
        this.applySearch(); // Apply current search after loading
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load popular talks', 'Close', { duration: 5000 });
      }
    });
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
    if (!this.searchTerm.trim()) {
      this.filteredTalks = [...this.talks];
      return;
    }

    const normalizedSearch = this.searchTerm.toLowerCase();
    this.filteredTalks = this.talks.filter(talk =>
      talk.title.toLowerCase().includes(normalizedSearch)
    );
  }

  getDisplayTalks(): Talk[] {
    return this.filteredTalks;
  }

  highlightMatch(text: string, searchTerm: string): string {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  clearSearch(): void {
    this.searchControl.setValue('');
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
      weekday: 'short', 
      month: 'short', 
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
        // Reload to get updated rankings
        this.loadPopularTalks();
      },
      error: (error) => {
        this.snackBar.open('Failed to save rating', 'Close', { duration: 3000 });
      }
    });
  }

  openRecording(recordingUrl: string): void {
    window.open(recordingUrl, '_blank');
  }

  goToSchedule(): void {
    this.router.navigate(['/']);
  }
}
