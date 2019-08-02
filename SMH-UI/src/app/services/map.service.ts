import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  //url = "http://150.163.17.143:8181/smh-api/terrama/resources/viewslayer";


  constructor(private httpClient: HttpClient) { }

  listar(url) {
    return this.httpClient.get(url);
  }
}
