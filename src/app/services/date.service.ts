import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private selectedDateSource = new BehaviorSubject<string>('tomorrow');
  selectedDate$ = this.selectedDateSource.asObservable();

  setSelectedDate(date: string) {
    this.selectedDateSource.next(date); // Seçilen tarihi güncelle
    console.log('setselecteddate',date)
  }
  setDate(date: string) {
    this.selectedDateSource.next(date);
    console.log('setdate')

  }
}
