import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Analysis } from '../raster/analysis';
import { RepositoryApi } from '../enums/repository-api.enum';
import { UfAPI } from '../raster/uf';
import { CityAPI } from '../raster/city';
import { element } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})

export class PythonFlaskAPIService {
  private colors = { 'blue': '#007bff', 'red': '#ff2f00' };
  constructor(private httpClient: HttpClient) { }

  getStates() {
    return this.httpClient.get<UfAPI>(RepositoryApi.smh_api + '/api-flask/states');
  }

  getCities(uf: string) {
    return this.httpClient.get<CityAPI>(RepositoryApi.smh_api + '/api-flask/cities?uf=' + uf);
  }

  getAnMonthly(geocodigo: string, start: Date, end: Date) {
    console.log(
      RepositoryApi.smh_api +
      '/api-flask/analysis-monthly-by-city?' +
      'geocodigo=' + geocodigo + '&' +
      'start_date=' + start.getFullYear() + '-' + (start.getMonth() + 1) + '&' +
      'end_date=' + end.getFullYear() + '-' + (end.getMonth() + 1)
    );
    return this.httpClient.get<Analysis>(
      RepositoryApi.smh_api +
      '/api-flask/analysis-monthly-by-city?' +
      'geocodigo=' + geocodigo + '&' +
      'start_date=' + start.getFullYear() + '-' + (start.getMonth() + 1) + '&' +
      'end_date=' + end.getFullYear() + '-' + (end.getMonth() + 1)
    );
  }

  getAnDaily(geocodigo: string, start: Date, end: Date) {
    return this.httpClient.get<Analysis>(
      RepositoryApi.smh_api +
      '/api-flask/analysis-daily-by-city?' +
      'geocodigo=' + geocodigo + '&' +
      'start_date=' + start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate() + '&' +
      'end_date=' + end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
    );
  }

  extractDateTimeline(data: Analysis) {
    let result = this.convertToArray(data.result);
    let dateTimeline = [];
    result.forEach(
      element => dateTimeline.push(element.date)
    )
    return dateTimeline;
  }

  extractClimMaxData(data: Analysis) {
    let result = this.convertToArray(data.result);
    let climMaxData: number[] = [];
    result.forEach(
      element => climMaxData.push(element.climatologico.clim_maxima)
    )
    return climMaxData;
  }

  extractClimMeanData(data: Analysis) {
    let result = this.convertToArray(data.result);
    let climMeanData: number[] = [];
    result.forEach(
      element => climMeanData.push(element.climatologico.clim_media)
    )
    return climMeanData;
  }

  extractMaxData(data: Analysis) {
    let result = this.convertToArray(data.result);
    let maxData: number[] = [];
    result.forEach(
      element => maxData.push(element.prec_maxima)
    )
    return maxData;
  }

  extractMeanData(data: Analysis) {
    let result = this.convertToArray(data.result);
    let meanData: number[] = [];
    result.forEach(
      element => meanData.push(element.prec_media)
    )
    return meanData;
  }

  extractAnomaliaData(data: Analysis) {
    let result = this.convertToArray(data.result);
    let anomaliaData: number[] = [];
    result.forEach(
      element => anomaliaData.push(element.anomalia)
    )
    return anomaliaData;
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
