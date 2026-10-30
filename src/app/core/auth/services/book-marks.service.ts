import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookMarksService {
  private readonly httpClient = inject(HttpClient)


  getBookMarks(): Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}users/bookmarks`)
  }
}
