import { Injectable } from '@angular/core';
import { IServices } from './interface/iservices';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { RoomBooking } from '../model/room-booking.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RoomBookingService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string; type?: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: RoomBooking[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomBooking.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('roomBooking')),
      catchError(this.handleError('roomBooking', []))
    );
  }

  getByCode(roomBookingCode: string): Observable<ApiResponse<RoomBooking>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomBooking.getByCode + roomBookingCode)
    .pipe(
      tap(_ => this.log('roomBooking')),
      catchError(this.handleError('roomBooking', []))
    );
  }

  create(data: any): Observable<ApiResponse<RoomBooking>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomBooking.create, data)
    .pipe(
      tap(_ => this.log('roomBooking')),
      catchError(this.handleError('roomBooking', []))
    );
  }

  update(id: string, data: any): Observable<ApiResponse<RoomBooking>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomBooking.update + id, data)
    .pipe(
      tap(_ => this.log('roomBooking')),
      catchError(this.handleError('roomBooking', []))
    );
  }

  updateStatus(id: string, data: any): Observable<ApiResponse<RoomBooking>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomBooking.updateStatus + id, data)
    .pipe(
      tap(_ => this.log('roomBooking')),
      catchError(this.handleError('roomBooking', []))
    );
  }

  handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }
  log(message: string) {
    console.log(message);
  }
}
