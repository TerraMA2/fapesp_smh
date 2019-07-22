import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WmsJsonService {
  private localhost = 'http://localhost:4863';
  constructor( private httpClient: HttpClient ) {}

}
