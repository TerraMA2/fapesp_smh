import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  url = "http://localhost:8080/smh-api/terrama/resources/viewslayer";

  constructor(private httpClient: HttpClient) { }

  listar() {
    return this.httpClient.get(this.url);
  }

}
