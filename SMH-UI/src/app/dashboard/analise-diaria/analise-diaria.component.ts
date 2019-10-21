import { Component, OnInit } from '@angular/core';

// Service
import { PythonFlaskAPIService } from 'src/app/services/python-flask-api.service';

// Inteface
import { Uf } from 'src/app/models/uf';
import { City } from 'src/app/models/city';
import { Option } from 'src/app/models/option';
import { AnaliseGeotiffDiffLimitDateDaily } from 'src/app/raster/analise-geotiff-diff-limit-date-daily';

@Component({
  selector: 'app-analise-diaria',
  templateUrl: './analise-diaria.component.html',
  styleUrls: ['./analise-diaria.component.css']
})
export class AnaliseDiariaComponent implements OnInit {

  dados: AnaliseGeotiffDiffLimitDateDaily[];

  private dataGrafico: any;

  private start: Date = new Date(2018, 0, 1);
  private end: Date = new Date(2018, 0, 31);
  private min: Date = new Date(2018, 0, 1);
  private max: Date = new Date(2018, 12, 31);

  private cities: City[];
  private selectedCity: City;

  private uf: Uf[];
  private selectedUf: Uf

  constructor(private apiFlask: PythonFlaskAPIService) { }

  ngOnInit() {
    this.initilizeUfList();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  initilizeUfList() {
    this.apiFlask.getStates().toPromise().then((data: any) => {
      this.uf = this.apiFlask.convertToStateAPI(data.estado, data.uf);
    });
  }

  loadCityByUf() {
    this.cities = [];
    this.apiFlask.getCities(this.selectedUf.uf).toPromise().then((data: any) => {
      this.cities = this.apiFlask.convertToCityAPI(
        data.nome_municipio, data.longitude, data.latitude, data.geocodigo
      );
    });
  }

  loadAnalise() {
    this.apiFlask.getDailylyMaxMeanDiffLimitDate(this.selectedCity.geocodigo, this.start, this.end).toPromise().then(
      (data: any) => {
        this.dados = this.apiFlask.convertToAnliseDailyAPI(
          data.maxima,
          data.media,
          data.dia,
          data.mes,
          data.execution_date,
          data.nome_municipio
        );
        this.dataGrafico = {
          labels: this.apiFlask.convertToArray(data.execution_date),
          datasets: [
            {
              label: "Média Climatológica " + this.dados[0].mes + " mm/dia",
              backgroundColor: '#55a7ff',
              borderColor: '#55a7ff',
              fill: false,
              data: this.apiFlask.convertToArray(data.dia)
            },
            {
              label: "Máxima Climatológica " + this.dados[0].mes + " mm/dia",
              backgroundColor: '#ff0000',
              borderColor: '#ff0000',
              fill: false,
              data: this.apiFlask.convertToArray(data.execution_date)
            }
          ]
        };
      }
    );
  }

}
