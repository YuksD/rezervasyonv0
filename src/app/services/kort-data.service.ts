import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KortDataService {

  constructor(private http: HttpClient) { }

  // Kort bilgilerini JSON dosyasından yükleyen fonksiyon
  getKortlar(): Observable<any> {
    return this.http.get('assets/kortlar.json');
  }

  // Rezervasyon bilgilerini JSON dosyasından yükleyen fonksiyon
  getRezervasyonlar(): Observable<any> {
    return this.http.get('assets/rezervasyonlar.json');
  }
}
