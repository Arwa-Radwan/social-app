import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuggestedService {
  private readonly httpClient = inject(HttpClient)

  getSuggested():Observable<any>{
   return this.httpClient.get(`${environment.BaseUrl}users/suggestions?limit=10`)
  }

followSuggest(suggestId: string): Observable<any> {
  return this.httpClient.put(`${environment.BaseUrl}users/${suggestId}/follow`, {});
}

followUnFollow(followId:string):Observable<any>{
  return this.httpClient.put(`${environment.BaseUrl}users/${followId}/follow`,{})
}

getUserProfile(profileId:string):Observable<any>{
  return this.httpClient.get(`${environment.BaseUrl}users/${profileId}/profile`)
}
  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}users/${userId}/posts`);
  }
}
