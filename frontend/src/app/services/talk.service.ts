import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Talk, TalksByDate } from '../models/talk.model';
import { RatingRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TalkService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllTalks(): Observable<TalksByDate> {
    return this.http.get<TalksByDate>(`${this.API_URL}/talks`);
  }

  getTalksByDate(date: string): Observable<Talk[]> {
    return this.http.get<Talk[]>(`${this.API_URL}/talks/date/${date}`);
  }

  getTalkById(id: number): Observable<Talk> {
    return this.http.get<Talk>(`${this.API_URL}/talks/${id}`);
  }

  rateTalk(ratingRequest: RatingRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/ratings`, ratingRequest);
  }

  getUserRatings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/ratings/user`);
  }

  getTalkRatings(talkId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/ratings/talk/${talkId}`);
  }
}
