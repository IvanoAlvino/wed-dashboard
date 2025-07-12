import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TalkService } from '../../services/talk.service';
import { AuthService } from '../../services/auth.service';
import { Talk, TalksByDate } from '../../models/talk.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-talk-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    StarRatingComponent
  ],
  template: `
    <div class="talk-list-container">
      <h1>WeAreDevelopers Conference Talks</h1>
      
      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner></mat-spinner>
        <p>Loading talks...</p>
      </div>
      
      <div *ngIf="!loading && talksByDate">
        <div *ngFor="let dateEntry of getDateEntries()" class="date-section">
          <div class="date-header">
            <h2>{{formatDate(dateEntry.date)}}</h2>
          </div>
          
          <div class="talks-grid">
            <mat-card *ngFor="let talk of dateEntry.talks" class="talk-card">
              <mat-card-header>
                <mat-card-title>{{talk.title}}</mat-card-title>
                <mat-card-subtitle>
                  by {{talk.speaker}} • {{formatTime(talk.startTime)}}
                  <span *ngIf="talk.endTime"> - {{formatTime(talk.endTime)}}</span>
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <p *ngIf="talk.description">{{talk.description}}</p>
                
                <div class="talk-meta">
                  <mat-chip-set *ngIf="talk.track || talk.room">
                    <mat-chip *ngIf="talk.track" color="primary">{{talk.track}}</mat-chip>
                    <mat-chip *ngIf="talk.room">
                      <mat-icon>location_on</mat-icon>
                      {{talk.room}}
                    </mat-chip>
                  </mat-chip-set>
                </div>
                
                <div class="rating-section">
                  <div class="current-rating" *ngIf="talk.averageRating">
                    <span class="average-rating">
                      <mat-icon>star</mat-icon>
                      {{talk.averageRating | number:'1.1-1'}}
                    </span>
                    <span class="rating-count">({{talk.ratingCount}} ratings)</span>
                  </div>
                  
                  <div *ngIf="isLoggedIn()" class="user-rating">
                    <span>Your rating:</span>
                    <app-star-rating 
                      [rating]="talk.userRating || 0"
                      [interactive]="true"
                      (ratingChange)="onRatingChange(talk, $event)">
                    </app-star-rating>
                  </div>
                  
                  <div *ngIf="!isLoggedIn()" class="login-prompt">
                    <span>Login to rate this talk</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .talk-list-container {
      padding: 20px;
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      gap: 16px;
    }
    
    .date-section {
      margin-bottom: 32px;
    }
    
    .date-header {
      background: linear-gradient(135deg, #673ab7 0%, #9c27b0 100%);
      color: white;
      padding: 16px 24px;
      margin-bottom: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .date-header h2 {
      margin: 0;
      font-weight: 300;
    }
    
    .talks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 16px;
    }
    
    .talk-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .talk-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .talk-meta {
      margin: 16px 0;
    }
    
    .rating-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }
    
    .current-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .average-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      color: #ff9800;
    }
    
    .rating-count {
      font-size: 12px;
      color: #666;
    }
    
    .user-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }
    
    .login-prompt {
      font-size: 12px;
      color: #666;
      font-style: italic;
    }
    
    mat-chip {
      margin-right: 8px;
    }
    
    mat-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class TalkListComponent implements OnInit {
  talksByDate: TalksByDate | null = null;
  loading = true;

  constructor(
    private talkService: TalkService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTalks();
  }

  loadTalks(): void {
    this.loading = true;
    this.talkService.getAllTalks().subscribe({
      next: (data) => {
        this.talksByDate = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load talks', 'Close', { duration: 5000 });
      }
    });
  }

  getDateEntries(): { date: string; talks: Talk[] }[] {
    if (!this.talksByDate) return [];
    
    return Object.keys(this.talksByDate)
      .sort()
      .map(date => ({
        date,
        talks: this.talksByDate![date].sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        )
      }));
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
}
