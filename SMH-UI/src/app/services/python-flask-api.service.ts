import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from '../models/city';
import { AnaliseGeotiffDiffLimitDateMonthly } from '../raster/analise-geotiff-diff-limit-date-monthly';
import { AnaliseGeotiffDiffLimitDateDaily } from '../raster/analise-geotiff-diff-limit-date-daily';
import { RepositoryApi } from '../enums/repository-api.enum';
import { Uf } from '../models/uf';
import { Layers } from 'src/app/models/layers';

@Injectable({
  providedIn: 'root'
})

export class PythonFlaskAPIService {
  private colors = { 'blue': '#007bff', 'red': '#ff2f00' };
  constructor(private httpClient: HttpClient) { }

  getStates() {
    return this.httpClient.get(RepositoryApi.smh_api + '/states');
  }

  getCities(uf: string) {
    return this.httpClient.get(RepositoryApi.smh_api + '/cities/' + uf);
  }

  getMonthlyMaxMeanDiffLimitDate(geocodigo: string, start: Date, end: Date) {
    return this.httpClient.get<AnaliseGeotiffDiffLimitDateMonthly>(
      RepositoryApi.smh_api +
      '/analysis-monthly-by-city/' +
      geocodigo + '?' +
      'start_date=' + start.getFullYear() + '-' + (start.getMonth() + 1) + '&' +
      'end_date=' + end.getFullYear() + '-' + (end.getMonth() + 1)
    );
  }
  
  getDailyMaxMeanDiffLimitDate(geocodigo: string, start: Date, end: Date) {
    return this.httpClient.get<AnaliseGeotiffDiffLimitDateDaily>(
      RepositoryApi.smh_api +
      '/analysis-daily-by-city/' +
      geocodigo + '?' +
      'start_date=' + start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate() + '&' +
      'end_date=' + end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
    );
  }

  convertToCityAPI(nome_municipio: string[], longitude: number[], latitude: number[], geocodigo: string[]) {
    let cities: City[] = [];
    for (let i in nome_municipio) { cities[i] = { nome_municipio: nome_municipio[i], longitude: longitude[i], latitude: latitude[i], geocodigo: geocodigo[i] }; }
    return cities;
  }

  convertToStateAPI(estado: string[], uf: string[]) {
    let states: Uf[] = [];
    for (let i in estado) { states[i] = { estado: estado[i], uf: uf[i] }; }
    return states;
  }

  convertToLayerAPI(layername: string[], name: string[], source_type: number[], uri: string[], workspace: string[]) {
    let layers: Layers[] = [];
    for (let i in layername) {
      layers[i] = { layername: layername[i], name: name[i], source_type: source_type[i], uri: uri[i], workspace: workspace[i] };
    }
    return layers;
  }

  convertToAnliseMonthlyAPI(
    ano: number[],
    maxima: number[],
    maxima_ano: number[],
    media: number[],
    media_ano: number[],
    mes: string[],
    nome_municipio: string[],
    anomalia: number[],
    format_date: string[],
  ) {
    let analises: AnaliseGeotiffDiffLimitDateMonthly[] = [];
    for (let i in ano) {
      analises[i] = {
        ano: ano[i],
        maxima: maxima[i],
        maxima_ano: maxima_ano[i],
        media: media[i],
        media_ano: media_ano[i],
        mes: mes[i],
        nome_municipio: nome_municipio[i],
        anomalia: anomalia[i],
        format_date: format_date[i],
      }
    }
    return analises;
  }

  convertToAnliseDailyAPI(
    maxima: number[],
    media: number[],
    maxima_mes: number[],
    media_mes: number[],
    anomalia: number[],
    dia: number[],
    mes: string[],
    execution_date: Date[],
    nome_municipio: string[],
    format_date: string[]
  ) {
    let analises: AnaliseGeotiffDiffLimitDateDaily[] = [];
    for (let i in dia) {
      analises[i] = {
        maxima: maxima[i],
        media: media[i],
        maxima_mes: maxima_mes[i],
        media_mes: media_mes[i],
        anomalia: anomalia[i],
        dia: dia[i],
        mes: mes[i],
        execution_date: execution_date[i],
        nome_municipio: nome_municipio[i],
        format_date: format_date[i]
      }
    }
    return analises;
  }

  convertToArray(obj: Object) {
    let vetor = [];
    for (let i = 0; obj[i] != null; i++) { vetor[i] = obj[i]; }
    return vetor;
  }

  convertToColors(obj: Object) {
    let vetor = [];
    for (let i = 0; obj[i] != null; i++) {
      if (obj[i] < 0) { vetor[i] = this.colors['red'] }
      else { vetor[i] = this.colors['blue'] }
    }
    return vetor;
  }

  compareDates(start: Date, end: Date) {
    return Math.abs((end.getMonth() + 12 * end.getFullYear()) - (start.getMonth() + 12 * start.getFullYear()));
  }
}
