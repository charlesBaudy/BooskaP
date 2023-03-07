import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cable } from '../models/cable';


@Injectable({
  providedIn: 'root'
})
export class CablesService {

  // private apiCableUrl = 'http://localhost:3000/api/cables';

  private apiCableUrl = 'http://ec2-18-117-154-6.us-east-2.compute.amazonaws.com:3000/api/cables';

  constructor(private http: HttpClient) { }

  getAllCables(): Observable<Cable[]> {
    return this.http.get<Cable[]>(`${this.apiCableUrl}/getAll`);
  }
  
  getCableById(cableId: number): Observable<Cable> {
    return this.http.get<Cable>(`${this.apiCableUrl}/getById`, { params: { cableId: cableId.toString() } });
  }
  
  setOk(cableId: number, value: boolean): Observable<any> {
    return this.http.post<any>(`${this.apiCableUrl}/setOk`, { id: cableId, value: value });
  }
}
