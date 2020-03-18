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

// Inteface
import { Uf } from 'src/app/models/uf';
import { City } from 'src/app/models/city';
import { UfAPI } from 'src/app/raster/uf';
import { CityAPI } from 'src/app/raster/city';
import { Grafico } from 'src/app/models/grafico';

// Enum
import { GraficoEnum } from 'src/app/enums/grafico-enum.enum';
import { Analysis } from 'src/app/raster/analysis';

@Component({
  selector: 'app-analise-diaria',
  templateUrl: './analise-diaria.component.html',
  styleUrls: ['./analise-diaria.component.css']
})
export class AnaliseDiariaComponent implements OnInit {
  private mapAnalysisDaily;
  private osm;

  private dataGrafico: any;

  private grafico: Grafico[] = [
    { nomeGrafico: GraficoEnum.Máxima },
    { nomeGrafico: GraficoEnum.Média }
  ];
  private selectedGrafico: Grafico;

  private start: Date = new Date(1998, 0, 1);
  private end: Date = new Date(1998, 0, 31);
  private min: Date = new Date(1998, 0, 1);
  private max: Date = new Date(1998, 11, 31);

  private cities: City[];
  private selectedCity: City;

  private uf: Uf[];
  private selectedUf: Uf

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
    this.mapAnalysisDaily = new Map({
      target: 'mapAnalysisDaily',
      layers: layers,
      controls: [control],
      view: view
    });

    this.mapAnalysisDaily.on('singleclick', function (evt) {
      console.log(evt.pixel);
    });
    function changeMap() {
      console.log('name');
    }
  }

  loadAnalise() {
    this.mapAnalysisDaily.setView(new View({
      center: [this.selectedCity.longitude, this.selectedCity.latitude], zoom: 12, projection: 'EPSG:4326'
    }));
    this.apiFlask.getAnDaily(this.selectedCity.geocodigo, this.start, this.end).toPromise().then(
      (data: Analysis) => {
        this.dados = data.result;
        switch (this.selectedGrafico.nomeGrafico) {
          case "Preciptação Máxima":
            this.dataGrafico = {
              labels: this.apiFlask.extractDateTimeline(data),
              datasets: [
                {
                  label: "Máxima Climatológica mm/dia",
                  backgroundColor: '#007bff',
                  borderColor: '#007bff',
                  fill: false,
                  data: this.apiFlask.extractClimMaxData(data)
                }
              ]
            };
            break;
          case "Preciptação Acumulada Média":
            this.dataGrafico = {
              labels: this.apiFlask.extractDateTimeline(data),
              datasets: [
                {
                  label: "Média Climatológica mm/dia",
                  backgroundColor: '#007bff',
                  borderColor: '#007bff',
                  fill: false,
                  data: this.apiFlask.extractClimMeanData(data)
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
