import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CityByStateUnique } from '../interface/city-by-state-unique';
import { RepositoryApi } from '../enuns/repository-api.enum';

@Injectable({
  providedIn: 'root'
})

export class PythonFlaskAPIService{
  private colors = {'blue':'#007bff','red':'#ff2f00'};
  constructor( private httpClient: HttpClient ) {}

  getCities(uf: string){
    return this.httpClient.get(RepositoryApi.smh_api + '/cities/' + uf);
  }

  getMonthlyMaxMeanDiffLimitDate(geocodigo: string, start: Date, end: Date){
    return this.httpClient.get(
      RepositoryApi.smh_api +
      '/an_monthly_diff_limit_date/' +
      geocodigo + '/' +
      (start.getMonth() + 1) + '/' +
      start.getFullYear() + '/' +
      (end.getMonth() + 1) + '/' +
      end.getFullYear()
    );
  }

  convertToCityAPI(nome1: string[], longitude: number[], latitude: number[], geocodigo: string[]){
    let cities: CityByStateUnique[] = [];
    for( let i in nome1 ){ cities[i] = { nome1 : nome1[i], longitude: longitude[i], latitude : latitude[i], geocodigo : geocodigo[i] }; }
    return cities;
  }

  convertToArray(obj: Object){
    let vetor = [];
    for( let i = 0; obj[i] != null; i++ ){ vetor[i] = obj[i]; }
    return vetor;
  }

  convertToColors(obj: Object){
    let vetor = [];
    for( let  i = 0; obj[i] != null; i++){
      if( obj[i] < 0) { vetor[i] = this.colors['red'] }
      else { vetor[i] = this.colors['blue'] }
    }
    return vetor;
  }
}