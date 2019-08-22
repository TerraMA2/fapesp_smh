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
import { AnaliseDadosService } from 'src/app/services/analise-dados.service';
import { MunicipioService } from 'src/app/services/municipio.service';

// Inteface
import { Uf } from 'src/app/interface/uf';
import { Grafico } from 'src/app/interface/grafico';
import { City } from 'src/app/interface/city';
import { AnaliseGeotiffDiffLimitDate } from 'src/app/raster/analise-geotiff-diff-limit-date';

// Enum
import { UfEnum } from 'src/app/enums/uf-enum.enum';
import { GraficoEnum } from 'src/app/enums/grafico-enum.enum';
import { RepositoryApi } from 'src/app/enums/repository-api.enum';

@Component({
  selector: 'app-analise-mensal',
  templateUrl: './analise-mensal.component.html',
  styleUrls: ['./analise-mensal.component.css']
})
export class AnaliseMensalComponent implements OnInit {

  private mapAnalise;
  private osm;
  
  dados: AnaliseGeotiffDiffLimitDate[];
  private dataGrafico: any;
  private start: Date = new Date(1998,0,31);
  private end: Date = new Date(1998,11,31);
  private min: Date = new Date(1998,0,31);
  private max: Date = new Date(2004,11,31);

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

  constructor( private apiFlask: PythonFlaskAPIService, private analiseService: AnaliseDadosService, private municipioService: MunicipioService) { }

  ngOnInit() {
    this.initilizeUfList();
    this.initilizeMap();
  }

  initilizeUfList() {
    this.apiFlask.getStates().toPromise().then((data: any) => {
      this.uf = this.apiFlask.convertToStateAPI(data.estado,data.uf);
    });
  }

  loadCityByUf() {
    this.cities = [];
    this.apiFlask.getCities(this.selectedUf.uf).toPromise().then((data: any) => {
      this.cities = this.apiFlask.convertToCityAPI(
        data.nome1,data.longitude,data.latitude,data.geocodigo
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
    this.mapAnalise = new Map({
      target: 'mapAnalise',
      layers: layers,
      // interactions: [interaction],
      controls: [control],
      view: view
    });

    this.mapAnalise.on('singleclick', function (evt) {
      console.log(evt.pixel);
    });
    function changeMap() {
      console.log('name');
    }
  }

  loadAnalise() {
    this.mapAnalise.setView(new View({
      center: [this.selectedCity.longitude, this.selectedCity.latitude], zoom: 12, projection: 'EPSG:4326'
    }));
    console.log(this.apiFlask.compareDates(this.end, this.start));
    if ( this.apiFlask.compareDates(this.end, this.start) < 20 && this.end >= this.start ) {
      this.apiFlask.getMonthlyMaxMeanDiffLimitDate(this.selectedCity.geocodigo, this.start, this.end).toPromise().then(
        (data: any) =>  {
          this.dados = this.apiFlask.convertToAnliseAPI(
            data.ano,
            data.maxima,
            data.maxima_ano,
            data.media,
            data.media_ano,
            data.mes,
            data.nome_municipio,
            data.var_maxima,
            data.var_media,
            data.format_date
          );
          switch(this.selectedGrafico.nomeGrafico) {
            case "Máxima":
              this.dataGrafico = {
                labels: this.apiFlask.convertToArray(data.format_date),
                datasets: [
                  {
                    label: "Climatológico mm/mês",
                    backgroundColor: '#007bff',
                    borderColor: '#55a7ff',
                    /// fill: false,
                    data: this.apiFlask.convertToArray(data.maxima)
                  },
                  {
                    label: "Máxima mm/mês",
                    backgroundColor: '#80bdff',
                    borderColor: '#9ecdff',
                    /// fill: false,
                    data: this.apiFlask.convertToArray(data.maxima_ano)
                  }
                ]
              };
              break;
            case "Média":
              this.dataGrafico = {
                labels: this.apiFlask.convertToArray(data.format_date),
                datasets: [
                  {
                    label: "Climatológico mm/mês",
                    backgroundColor: '#007bff',
                    borderColor: '#55a7ff',
                    /// fill: false,
                    data: this.apiFlask.convertToArray(data.media)
                  },
                  {
                    label: "Média mm/mês",
                    backgroundColor: '#80bdff',
                    borderColor: '#9ecdff',
                    /// fill: false,
                    data: this.apiFlask.convertToArray(data.media_ano)
                  }
                ]
              };
              break;
            case "Anomalia":
              this.dataGrafico = {
                labels: this.apiFlask.convertToArray(data.format_date),
                datasets: [
                  {
                    label: 'Anomalia mm/mês',
                    backgroundColor: this.apiFlask.convertToColors(data.var_media),
                    borderColor: this.apiFlask.convertToColors(data.var_media),
                    data: this.apiFlask.convertToArray(data.var_media)
                  }
                ]
              }
              break;
            default:
              alert("Selecione uma cidade e um estado com uma variável do gráfico!");
              break;
          }
        }
      );
    } else {
      if (this.end < this.start) {
        alert("Data final maior que a inicial!");
        this.end = new Date((this.start.getFullYear() + 1),this.start.getMonth(),1);
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
