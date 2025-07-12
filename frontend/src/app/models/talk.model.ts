export interface Talk {
  id: number;
  title: string;
  speaker: string;
  date: string;
  startTime: string;
  endTime?: string;
  description?: string;
  track?: string;
  room?: string;
  averageRating?: number;
  ratingCount?: number;
  userRating?: number;
}

export interface TalksByDate {
  [date: string]: Talk[];
}
