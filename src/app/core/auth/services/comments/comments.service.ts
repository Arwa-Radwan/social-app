import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient)
  getComments(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}posts/${postId}/comments`);
  }

  createComment(postId: string, content: string): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}posts/${postId}/comments`, { content });
  }

  updateComment(postId: string, commentId: string, content: string): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}posts/${postId}/comments/${commentId}`, { content });
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(`${environment.BaseUrl}posts/${postId}/comments/${commentId}`);
  }
  likeComment(postId: string, commentId: string): Observable<any> {
  return this.httpClient.put(`${environment.BaseUrl}posts/${postId}/comments/${commentId}/like`, {});
}

getReplies(postId: string, commentId: string): Observable<any> {
  return this.httpClient.get(`${environment.BaseUrl}posts/${postId}/comments/${commentId}/replies`);
}

createReply(postId: string, commentId: string, content: string): Observable<any> {
  return this.httpClient.post(`${environment.BaseUrl}posts/${postId}/comments/${commentId}/replies`, { content });
}
}
