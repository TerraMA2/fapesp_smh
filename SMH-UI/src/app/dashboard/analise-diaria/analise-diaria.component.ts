import { Component, OnInit } from '@angular/core';

// Service
import { PythonFlaskAPIService } from 'src/app/services/python-flask-api.service';

// Inteface
import { Uf } from 'src/app/models/uf';
import { City } from 'src/app/models/city';
import { Grafico } from 'src/app/models/grafico';
import { GraficoEnum } from 'src/app/enums/grafico-enum.enum';
import { AnaliseGeotiffDiffLimitDateDaily } from 'src/app/raster/analise-geotiff-diff-limit-date-daily';

@Component({
  selector: 'app-analise-diaria',
  templateUrl: './analise-diaria.component.html',
  styleUrls: ['./analise-diaria.component.css']
})
export class AnaliseDiariaComponent implements OnInit {

  dados: AnaliseGeotiffDiffLimitDateDaily[];

  private dataGrafico: any;

  private grafico: Grafico[] = [
    { nomeGrafico: GraficoEnum.Máxima },
    { nomeGrafico: GraficoEnum.Média }
  ];
  private selectedGrafico: Grafico;

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

  initilizeOptions() {

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
        switch (this.selectedGrafico.nomeGrafico) {
          case "Preciptação Máxima":
              this.dataGrafico = {
                labels: this.apiFlask.convertToArray(data.execution_date),
                datasets: [
                  {
                    label: "Máxima Climatológica " + this.dados[0].mes + " mm/dia",
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                    fill: false,
                    data: this.apiFlask.convertToArray(data.maxima)
                  }
                ]
              };
            break;
          case "Preciptação Acumulada Média":
              this.dataGrafico = {
                labels: this.apiFlask.convertToArray(data.execution_date),
                datasets: [
                  {
                    label: "Média Climatológica " + this.dados[0].mes + " mm/dia",
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                    fill: false,
                    data: this.apiFlask.convertToArray(data.media)
                  }
                ]
              };
            break;
          default:
            alert("Selecione uma cidade e um estado com uma variável do gráfico!");
            break;
        }
      }
    );
  }
}
