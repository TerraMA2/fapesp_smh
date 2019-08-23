import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from '../interface/city';
import { AnaliseGeotiffDiffLimitDate } from '../raster/analise-geotiff-diff-limit-date';
import { RepositoryApi } from '../enums/repository-api.enum';
import { Uf } from '../interface/uf';
import { Layers } from 'src/app/models/layers';

@Injectable({
  providedIn: 'root'
})

export class PythonFlaskAPIService{
  private colors = {'blue':'#007bff','red':'#ff2f00'};
  constructor( private httpClient: HttpClient ) {}

  getStates(){
    return this.httpClient.get(RepositoryApi.smh_api + '/states');
  }

  getCities(uf: string){
    return this.httpClient.get(RepositoryApi.smh_api + '/cities/' + uf);
  }

  getMonthlyMaxMeanDiffLimitDate(geocodigo: string, start: Date, end: Date){
    return this.httpClient.get<AnaliseGeotiffDiffLimitDate>(
      RepositoryApi.smh_api +
      '/analise/' +
      geocodigo + '/' +
      (start.getMonth() + 1) + '/' +
      start.getFullYear() + '/' +
      (end.getMonth() + 1) + '/' +
      end.getFullYear()
    );
  }

  convertToCityAPI(nome1: string[], longitude: number[], latitude: number[], geocodigo: string[]){
    let cities: City[] = [];
    for( let i in nome1 ){ cities[i] = { nome1 : nome1[i], longitude: longitude[i], latitude : latitude[i], geocodigo : geocodigo[i] }; }
    return cities;
  }

  convertToStateAPI(estado: string[], uf: string[]){
    let states: Uf[] = [];
    for( let i in estado ){ states[i] = { estado : estado[i], uf : uf[i] }; }
    return states;
  }

  convertToLayerAPI(layername: string[], name: string[], source_type: number[], uri: string[], workspace: string[]) {
    let layers: Layers[] = [];
       for (let i in layername) {
      layers[i] = { layername: layername[i], name: name[i], source_type: source_type[i], uri: uri[i], workspace: workspace[i] };
    }
    return layers;
  }

  convertToAnliseAPI(
    ano: number[],
    maxima: number[],
    maxima_ano: number[],
    media: number[],
    media_ano: number[],
    mes: string[],
    nome_municipio: string[],
    var_maxima: number[],
    var_media: number[],
    format_date: string[],
  ){
    let analises: AnaliseGeotiffDiffLimitDate[] = [];
    for( let i in ano ){
      analises[i] = {
        ano: ano[i],
        maxima: maxima[i],
        maxima_ano: maxima_ano[i],
        media: media[i],
        media_ano: media_ano[i],
        mes: mes[i],
        nome_municipio: nome_municipio[i],
        var_maxima: var_maxima[i],
        var_media: var_media[i],
        format_date: format_date[i],
      }
    }
    return analises;
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

  compareDates(start: Date, end: Date){
    return Math.abs((end.getMonth()+12*end.getFullYear())-(start.getMonth()+12*start.getFullYear()));
  }
}