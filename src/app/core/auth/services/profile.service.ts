import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly httpClient = inject(HttpClient)
  userPhoto = signal<string | null>(null);


  getProfile(): Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}users/profile-data`)
  }

 uploadPhoto(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('photo', file);
  return this.httpClient.put(`${environment.BaseUrl}users/upload-photo`, formData);
}

uploadCover(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('cover', file);
  return this.httpClient.put(`${environment.BaseUrl}users/upload-cover`, formData);
}
}
