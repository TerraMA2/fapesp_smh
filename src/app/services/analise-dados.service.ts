import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnaliseDadosService {

  constructor(private httpClient: HttpClient) { }

  listar(url) {
    return this.httpClient.get(url);
  }

}
