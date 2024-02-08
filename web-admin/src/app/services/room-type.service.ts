import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { RoomType } from '../model/room-type.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: RoomType[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomType.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('roomType')),
      catchError(this.handleError('roomType', []))
    );
  }

  getByCode(roomTypeCode: string): Observable<ApiResponse<RoomType>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomType.getByCode + roomTypeCode)
    .pipe(
      tap(_ => this.log('roomType')),
      catchError(this.handleError('roomType', []))
    );
  }

  create(data: any): Observable<ApiResponse<RoomType>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomType.create, data)
    .pipe(
      tap(_ => this.log('roomType')),
      catchError(this.handleError('roomType', []))
    );
  }

  update(roomTypeCode: string, data: any): Observable<ApiResponse<RoomType>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomType.update + roomTypeCode, data)
    .pipe(
      tap(_ => this.log('roomType')),
      catchError(this.handleError('roomType', []))
    );
  }

  delete(roomTypeCode: string): Observable<ApiResponse<RoomType>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.roomType.delete + roomTypeCode)
    .pipe(
      tap(_ => this.log('roomType')),
      catchError(this.handleError('roomType', []))
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
