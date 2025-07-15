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
  templateUrl: './popular-talks.component.html',
  styleUrls: ['./popular-talks.component.scss']
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

  private reloadRankingsQuietly(): void {
    // Reload rankings without showing loading spinner to preserve UI state
    this.talkService.getPopularTalks().subscribe({
      next: (data) => {
        this.talks = data;
        this.applySearch(); // Reapply current search
      },
      error: (error) => {
        // Silently handle errors to avoid disrupting user experience
        console.error('Failed to reload rankings:', error);
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
      next: (updatedTalk) => {
        // Update the talk with new statistics from the API response
        talk.userRating = updatedTalk.userRating;
        talk.averageRating = updatedTalk.averageRating;
        talk.ratingCount = updatedTalk.ratingCount;
        this.snackBar.open('Rating saved!', 'Close', { duration: 2000 });
        // Reload to get updated rankings without showing loading spinner
        this.reloadRankingsQuietly();
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
