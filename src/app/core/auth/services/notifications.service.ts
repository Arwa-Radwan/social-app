import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  unreadCount = signal(0);

  refreshUnreadCount() {
    this.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount.set(res.data?.unreadCount ?? res.data?.count ?? 0);
      },
      error: () => this.unreadCount.set(0),
    });
  }

  getNotifications(unread = false, page = 1, limit = 10): Observable<any> {
    const params = new HttpParams()
      .set('unread', unread)
      .set('page', page)
      .set('limit', limit);
    return this.httpClient.get(`${environment.BaseUrl}notifications`, { params });
  }

  getAllNotifications(): Observable<any[]> {
    const base = `${environment.BaseUrl}notifications`;
    const make = (unread: boolean) =>
      this.httpClient.get<any>(base, {
        params: new HttpParams().set('unread', unread).set('page', 1).set('limit', 50),
      });

    return forkJoin([make(true), make(false)]).pipe(
      map(([a, b]) => {
        const merged = [...(a.data?.notifications ?? []), ...(b.data?.notifications ?? [])];
        const unique = new Map(merged.map(n => [n._id, n]));
        return [...unique.values()].sort(
          (x, y) => +new Date(y.createdAt) - +new Date(x.createdAt));
      }),
    );
  }

  getUnreadCount(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}notifications/unread-count`);
  }

  markAsRead(id: string): Observable<any> {
    return this.httpClient.patch(`${environment.BaseUrl}notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.httpClient.patch(`${environment.BaseUrl}notifications/read-all`, {});
  }
}
