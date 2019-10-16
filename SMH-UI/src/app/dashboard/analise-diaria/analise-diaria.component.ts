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

  private options: Option[];
  private selected: Option = { name: "Janeiro", value: 1 };

  private cities: City[];
  private selectedCity: City;

  private uf: Uf[];
  private selectedUf: Uf

  constructor(private apiFlask: PythonFlaskAPIService) { }

  ngOnInit() {
    this.options = [
      { name: 'Janeiro', value: 1 },
      { name: 'Fevereiro', value: 2 },
      { name: 'Março', value: 3 },
      { name: 'Abril', value: 4 },
      { name: 'Maio', value: 5 },
      { name: 'Junho', value: 6 },
      { name: 'Julho', value: 7 },
      { name: 'Agosto', value: 8 },
      { name: 'Setembro', value: 9 },
      { name: 'Outubro', value: 10 },
      { name: 'Novembro', value: 11 },
      { name: 'Dezembro', value: 12 }
    ]
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
    this.apiFlask.getDailylyMaxMeanDiffLimitDate(this.selectedCity.geocodigo, this.selected.name).toPromise().then(
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
          labels: this.apiFlask.convertToArray(data.dia),
          datasets: [
            {
              label: "Média Climatológica " + this.selected.name + " mm/dia",
              backgroundColor: '#55a7ff',
              borderColor: '#55a7ff',
              fill: false,
              data: this.apiFlask.convertToArray(data.media)
            },
            {
              label: "Máxima Climatológica " + this.selected.name + " mm/dia",
              backgroundColor: '#ff0000',
              borderColor: '#ff0000',
              fill: false,
              data: this.apiFlask.convertToArray(data.maxima)
            }
          ]
        };
      }
    );
  }

}
