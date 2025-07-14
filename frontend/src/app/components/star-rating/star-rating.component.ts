import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
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
