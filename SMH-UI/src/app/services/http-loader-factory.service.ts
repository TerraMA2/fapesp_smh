import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpLoaderFactoryService {

  constructor(private httpClient: HttpClient) { 
  }
  ResponseToURL(url) {
    return this.httpClient.get(url);
  }
}
