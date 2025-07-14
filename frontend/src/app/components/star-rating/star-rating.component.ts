import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="star-rating" [class.small]="size === 'small'">
      <mat-icon 
        *ngFor="let star of stars; let i = index"
        class="star"
        [class.filled]="i < rating"
        [class.hover]="interactive && i < hoveredRating"
        [class.interactive]="interactive"
        (click)="interactive && onStarClick(i + 1)"
        (mouseenter)="interactive && onStarHover(i + 1)"
        (mouseleave)="interactive && onStarLeave()">
        {{ i < rating ? 'star' : 'star_border' }}
      </mat-icon>
    </div>
  `,
  styles: [`
    .star-rating {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    
    .star-rating.small {
      gap: 1px;
    }
    
    .star {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #ddd;
      transition: color 0.2s ease;
    }
    
    .star-rating.small .star {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .star.filled {
      color: #ffd700;
    }
    
    .star.hover {
      color: #ffed4e;
    }
    
    .star.interactive {
      cursor: pointer;
    }
    
    .star.interactive:hover {
      transform: scale(1.1);
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() interactive: boolean = false;
  @Input() size: 'normal' | 'small' = 'normal';
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoveredRating = 0;

  onStarClick(rating: number): void {
    if (this.interactive) {
      this.rating = rating;
      this.ratingChange.emit(rating);
    }
  }

  onStarHover(rating: number): void {
    if (this.interactive) {
      this.hoveredRating = rating;
    }
  }

  onStarLeave(): void {
    if (this.interactive) {
      this.hoveredRating = 0;
    }
  }
}
