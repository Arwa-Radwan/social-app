import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getAllPosts(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}posts`);
  }

    createPosts(body:any): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}posts`,body);
  }

    getSinglePost(postId:any): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}posts/${postId}`);
  }
    deletePost(postId:any): Observable<any> {
    return this.httpClient.delete(`${environment.BaseUrl}posts/${postId}`);
  }

  updatePost(postId: string, data: FormData): Observable<any> {
  return this.httpClient.put(`${environment.BaseUrl}posts/${postId}`, data);
}
sharePost(postId: string, body: string): Observable<any> {
  return this.httpClient.post(`${environment.BaseUrl}posts/${postId}/share`, { body });
}
getBookmarks(): Observable<any> {
  return this.httpClient.get(`${environment.BaseUrl}users/bookmarks`);
}

toggleBookmark(postId: string): Observable<any> {
  return this.httpClient.put(`${environment.BaseUrl}posts/${postId}/bookmark`, {});
}
likePost(postId: string): Observable<any> {
  return this.httpClient.put(`${environment.BaseUrl}posts/${postId}/like`, {});
}
getPostLikes(postId: string): Observable<any> {
  return this.httpClient.get(`${environment.BaseUrl}posts/${postId}/likes`);
}
}
