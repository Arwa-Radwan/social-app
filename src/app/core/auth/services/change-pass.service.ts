
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChangePassService {
  private readonly httpClient = inject(HttpClient)


  settings(data:any):Observable<any>{
    return this.httpClient.patch(`${environment.BaseUrl}users/change-password`, data)
  }
}
