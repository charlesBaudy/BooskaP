import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ild } from '../models/ild';

@Injectable({
  providedIn: 'root'
})
export class IldsService {

  // private apiIldUrl = 'http://localhost:3000/api/ild';

  private apiIldUrl = 'http://ec2-18-117-154-6.us-east-2.compute.amazonaws.com:3000/api/ild';

  constructor(private http: HttpClient) { }

  getAllIlds(): Observable<Ild[]> {
    return this.http.get<Ild[]>(`${this.apiIldUrl}/getAll`);
  }

  getIldById(id: number): Observable<Ild> {
    return this.http.get<Ild>(`${this.apiIldUrl}/getById?id=${id}`);
  }

  setIldOk(id: number, value: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiIldUrl}/setOk?id=${id}&value=${value}`);
  }
}
