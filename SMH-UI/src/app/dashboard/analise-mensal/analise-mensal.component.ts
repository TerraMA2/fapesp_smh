import { Component, OnInit } from '@angular/core';

//OpenLayer
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import FullScreen from 'ol/control/FullScreen';
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom';

// Service
import { PythonFlaskAPIService } from 'src/app/services/python-flask-api.service';

// Interfaces
import { Uf } from 'src/app/models/uf';
import { City } from 'src/app/models/city';
import { UfAPI } from 'src/app/raster/uf';
import { CityAPI } from 'src/app/raster/city';
import { Grafico } from 'src/app/models/grafico';

// Enum
import { GraficoEnum } from 'src/app/enums/grafico-enum.enum';
import { Analysis } from 'src/app/raster/analysis';

@Component({
  selector: 'app-analise-mensal',
  templateUrl: './analise-mensal.component.html',
  styleUrls: ['./analise-mensal.component.css']
})
export class AnaliseMensalComponent implements OnInit {

  private mapAnalysisMonthly;
  private osm;

  private dataGrafico: any;
  private start: Date = new Date(1998, 0, 31);
  private end: Date = new Date(1998, 11, 31);
  private min: Date = new Date(1998, 0, 31);
  private max: Date = new Date();

  private cities: City[];
  private selectedCity: City;

  private uf: Uf[];
  private selectedUf: Uf

  private grafico: Grafico[] = [
    { nomeGrafico: GraficoEnum.Máxima },
    { nomeGrafico: GraficoEnum.Média },
    { nomeGrafico: GraficoEnum.Anomalia }
  ];
  private selectedGrafico: Grafico;

  dados: any;

  constructor(private apiFlask: PythonFlaskAPIService) { }

  ngOnInit() {
    this.initilizeUfList();
    this.initilizeMap();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  initilizeUfList() {
    this.apiFlask.getStates().toPromise().then((data: UfAPI) => {
      this.uf = data.states;
    });
  }

  loadCityByUf() {
    this.cities = [];
    this.apiFlask.getCities(this.selectedUf.uf).toPromise().then((data: CityAPI) => {
      this.cities = data.municipios;
    });
  }

  initilizeMap() {
    var interaction = new DragRotateAndZoom();
    var control = new FullScreen();
    this.osm = new TileLayer({
      preload: Infinity,
      visible: true,
      title: "osm",
      baseLayer: true,
      source: new OSM(),
      layer: 'osm',
    });

    var center = [-6124801.2015823, -1780692.0106836];
    var view = new View({
      center: center,
      zoom: 4,
    });

    var layers = [this.osm];
    this.mapAnalysisMonthly = new Map({
      target: 'mapAnalysisMonthly',
      layers: layers,
      controls: [control],
      view: view
    });

    this.mapAnalysisMonthly.on('singleclick', function (evt) {
      console.log(evt.pixel);
    });
    function changeMap() {
      console.log('name');
    }
  }

  loadAnalise() {
    if (this.apiFlask.compareDates(this.end, this.start) < 20 && this.end >= this.start) {
      if (this.selectedCity && this.selectedGrafico) {
        this.mapAnalysisMonthly.setView(new View({
          center: [this.selectedCity.longitude, this.selectedCity.latitude], zoom: 12, projection: 'EPSG:4326'
        }));
        this.apiFlask.getAnMonthly(this.selectedCity.geocodigo, this.start, this.end).toPromise().then(
          (data: Analysis) => {
            this.dados = this.apiFlask.convertToArray(data.result);
            if (this.dados.length > 0) {
              switch (this.selectedGrafico.nomeGrafico) {
                case "Preciptação Máxima":
                  this.dataGrafico = {
                    labels: this.apiFlask.extractDateTimeline(data),
                    datasets: [
                      {
                        label: "Climatológico mm/mês",
                        backgroundColor: '#007bff',
                        borderColor: '#55a7ff',
                        data: this.apiFlask.extractClimMaxData(data)
                      },
                      {
                        label: "Máxima mm/mês",
                        backgroundColor: '#80bdff',
                        borderColor: '#9ecdff',
                        data: this.apiFlask.extractMaxData(data)
                      }
                    ]
                  };
                  break;
                case "Preciptação Acumulada Média":
                  this.dataGrafico = {
                    labels: this.apiFlask.extractDateTimeline(data),
                    datasets: [
                      {
                        label: "Climatológico mm/mês",
                        backgroundColor: '#007bff',
                        borderColor: '#55a7ff',
                        data: this.apiFlask.extractClimMeanData(data)
                      },
                      {
                        label: "Média mm/mês",
                        backgroundColor: '#80bdff',
                        borderColor: '#9ecdff',
                        data: this.apiFlask.extractMeanData(data)
                      }
                    ]
                  };
                  break;
                case "Anomalia":
                  this.dataGrafico = {
                    labels: this.apiFlask.extractDateTimeline(data),
                    datasets: [
                      {
                        label: 'Anomalia mm/mês',
                        backgroundColor: this.apiFlask.convertToColors(
                          this.apiFlask.extractAnomaliaData(data)
                        ),
                        borderColor: this.apiFlask.convertToColors(
                          this.apiFlask.extractAnomaliaData(data)
                        ),
                        data: this.apiFlask.extractAnomaliaData(data)
                      }
                    ]
                  }
                  break;
                default:
                  alert("Selecione uma cidade e um estado com uma variável do gráfico!");
                  break;
              }
            } else {
              alert("Dados não encontrados ou ainda não foram processados!");
            }
          }
        );
      } else {
        alert("Selecione uma cidade e um estado com uma variável do gráfico!");
      }
    } else {
      if (this.end < this.start) {
        alert("Data inicial maior que a final!");
        this.end = new Date((this.start.getFullYear() + 1), this.start.getMonth(), 1);
        this.loadAnalise();
      } else {
        alert("O limite é apenas 20 meses!");
      }
    }
  }

  private salvar() {
    console.log(this.start);
    console.log(this.end);
  }
}
