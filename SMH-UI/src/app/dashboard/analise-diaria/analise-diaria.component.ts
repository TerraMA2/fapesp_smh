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

  private mapAnalysisDaily;
  private osm;

  private dataGrafico: any;

  private grafico: Grafico[] = [
    { nomeGrafico: GraficoEnum.Máxima },
    { nomeGrafico: GraficoEnum.Média }/* ,
    { nomeGrafico: GraficoEnum.Anomalia } */
  ];
  private selectedGrafico: Grafico;

  private start: Date = new Date(2018, 0, 1);
  private end: Date = new Date(2018, 0, 31);
  private min: Date = new Date(2018, 0, 1);
  private max: Date = new Date(2018, 11, 31);

  private cities: City[];
  private selectedCity: City;

  private uf: Uf[];
  private selectedUf: Uf

  constructor(private apiFlask: PythonFlaskAPIService) { }

  ngOnInit() {
    this.initilizeUfList();
    this.initilizeMap();
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
      // interactions: [interaction],
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
    this.apiFlask.getDailyMaxMeanDiffLimitDate(this.selectedCity.geocodigo, this.start, this.end).toPromise().then(
      (data: any) => {
        this.dados = this.apiFlask.convertToAnliseDailyAPI(
          data.maxima,
          data.media,
          data.maxima_mes,
          data.media_mes,
          data.anomalia,
          data.dia,
          data.mes,
          data.execution_date,
          data.nome_municipio,
          data.format_date
        );
        switch (this.selectedGrafico.nomeGrafico) {
          case "Preciptação Máxima":
            this.dataGrafico = {
              labels: this.apiFlask.convertToArray(data.format_date),
              datasets: [
                {
                  label: "Máxima Climatológica mm/dia",
                  backgroundColor: '#007bff',
                  borderColor: '#007bff',
                  fill: false,
                  data: this.apiFlask.convertToArray(data.maxima)
                }/* ,
                {
                  label: "Máxima mm/dia",
                  backgroundColor: '#80bdff',
                  borderColor: '#80bdff',
                  fill: false,
                  data: this.apiFlask.convertToArray(data.maxima_mes)
                } */
              ]
            };
            break;
          case "Preciptação Acumulada Média":
            this.dataGrafico = {
              labels: this.apiFlask.convertToArray(data.format_date),
              datasets: [
                {
                  label: "Média Climatológica mm/dia",
                  backgroundColor: '#007bff',
                  borderColor: '#007bff',
                  fill: false,
                  data: this.apiFlask.convertToArray(data.media)
                }/* ,
                {
                  label: "Média mm/dia",
                  backgroundColor: '#80bdff',
                  borderColor: '#80bdff',
                  fill: false,
                  data: this.apiFlask.convertToArray(data.media_mes)
                } */
              ]
            };
            break;
          case "Anomalia":
            this.dataGrafico = {
              labels: this.apiFlask.convertToArray(data.execution_date),
              datasets: [
                {
                  label: "Anomalia mm/dia",
                  backgroundColor: this.apiFlask.convertToColors(data.anomalia),
                  borderColor: this.apiFlask.convertToColors(data.anomalia),
                  fill: false,
                  data: this.apiFlask.convertToArray(data.anomalia)
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
