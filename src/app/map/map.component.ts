import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import Map from 'ol/Map';
import {defaults as defaultControls, ScaleLine} from 'ol/control.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import View from 'ol/View';
import FullScreen from 'ol/control/FullScreen';
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON';
import * as olProj from 'ol/proj';

// Classes criadas
import { BaseLayers } from './base-layers/base-layers';
import { Layer } from './tile-layers/layer';

// Serviços Criados
import { MapService } from 'src/app/services/map.service';
import { WmsService } from 'src/app/services/wms.service';
import { PythonFlaskAPIService } from 'src/app/services/python-flask-api.service';

// Interfaces Criadas
import { AnaliseGeotiffByYear } from './rasters/analise-geotiff-by-year';
import { AnaliseGeotiffLimitDate } from './rasters/analise-geotiff-limit-date';
import { AnaliseGeotiffByYearDiff } from './rasters/analise-geotiff-by-year-diff';
import { AnaliseGeotiffDiffLimitDate } from './rasters/analise-geotiff-diff-limit-date';
import { AnaliseGeotiff } from './rasters/analise-geotiff';
import { CityByState } from './entities/city-by-state';
import { CityByStateUnique } from './entities/city-by-state-unique';
import { State } from './entities/state';
import { StateUnique } from './entities/state-unique';
import { Option } from './entities/option';
// import { Terrama2 } from './entities/terrama2';
// import { Terrama2Unique } from './entities/terrama2-unique';

// Camadas MapG
import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS';
import { OSM } from 'ol/source.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  private geoserver20Chuva = 'http://www.terrama2.dpi.inpe.br/chuva/geoserver/wms?';

  private map;
  private mapG;
  private baseLayers = new BaseLayers();
  private layersStatic = [];
  private layersDynamic = [];
  private layers = [];
  private features = [];

  // Busca de dados para as camadas merge e monthly
  private merge_date: Date = new Date(2018,0,31);
  private monthly_date: Date = new Date(1998,0,31);

  // Busca de cidades via codigo no python API
  private citySelectedAPI: CityByStateUnique;
  private ufSelectedAPI: StateUnique;
  private ufsAPI: StateUnique[] = [];
  private citiesAPI: CityByStateUnique[] = [];

  // Escolher gráfico
  private chartOption: Option[] = [
    { verbose: "Média", value: 0 },
    { verbose: "Anomalia Média", value: 1 },
    { verbose: "Máxima", value: 2 },
    { verbose: "Anomalia Máxima", value: 3 }
  ];
  private selectChartOption: Option = { verbose: "Média", value: 0 };
  private chartData: any;

  value: number = 0;
  testep: boolean = false;
  setMap: string = 'osm';
  mergeMonthlyDate: number = 1;

  // Controle das Datas
  minDate: Date;
  maxDate: Date;

  // Controle do gráfico
  private start: Date = new Date(1998,0,1);
  private end: Date = new Date(1998,11,31);

  // Banco de dados
  private jsonObj;

  // Menu Principal
  private items: MenuItem[];

  constructor(private mapService: MapService, private wmsService: WmsService, private apiFlask: PythonFlaskAPIService) { }

  ngOnInit() {
    this.promise();
    this.initDate();
    this.initLayers();
    this.initState();
    this.initilizeJson();
    this.initilizeMap();
    this.initilizeMapG();
    this.initilizeMenu();
  }

  promise() {
    this.mapService.listar().toPromise()
      .then((data: any) => {
        // console.time('request-length');
        // console.timeEnd('request-length');
        this.jsonObj = data;
        data.forEach(element => {
          this.features[element.name] = this.wmsService.camadas(element);
          this.map.addLayer(this.features[element.name]);
          this.mapG.addLayer(this.features[element.name]);
        });
      });
  }

  initDadosGrafico() {
    if ( this.citySelectedAPI ){
      this.setViewMap();
      this.wmsService.getRecort(this.layers[4].getTileLayer(),'geocodigo',this.citySelectedAPI.geocodigo);
      this.apiFlask.getMonthlyMaxMeanDiffLimitDate(this.citySelectedAPI.geocodigo,this.start,this.end).subscribe( (data: AnaliseGeotiffDiffLimitDate) => {
        let chartLabel = (
          'Anomalia Média ' +
          this.wmsService.getVerboseMonth(this.start) + '/' + this.start.getFullYear() + ' - ' +
          this.wmsService.getVerboseMonth(this.end) + '/' + this.end.getFullYear() +
          ' do Município de ' +
          this.citySelectedAPI.nome1 + ' - ' +
          this.ufSelectedAPI.estado
        );
        switch(this.selectChartOption.value){
          case 1:
            this.chartData = {
              labels: this.apiFlask.convertToArray(data.format_date),
              datasets: [
                {
                  label: chartLabel,
                  backgroundColor: this.apiFlask.convertToColors(data.var_media),
                  borderColor: this.apiFlask.convertToColors(data.var_media),
                  data: this.apiFlask.convertToArray(data.var_media)
                }
              ]
            };
            break;
          case 3:
            this.chartData = {
              labels: this.apiFlask.convertToArray(data.format_date),
              datasets: [
                {
                  label: chartLabel,
                  backgroundColor: this.apiFlask.convertToColors(data.var_maxima),
                  borderColor: this.apiFlask.convertToColors(data.var_maxima),
                  data: this.apiFlask.convertToArray(data.var_maxima)
                }
              ]
            };
            break;
          default:
            break;
        }
      });
      this.apiFlask.getMonthlyMaxMeanLimitDate(this.citySelectedAPI.geocodigo,this.start,this.end).subscribe( (data: AnaliseGeotiffLimitDate) => {
        let chartLabel = (
          'Climatológica Mensal do Município de ' +
          this.apiFlask.convertToArray(data.nome_municipio)[0].toString() + ' - ' +
          this.ufSelectedAPI.estado
        );
        let chartLabelDate = (
          this.wmsService.getVerboseMonth(this.start) + '/' + this.start.getFullYear() + ' - ' +
          this.wmsService.getVerboseMonth(this.end) + '/' + this.end.getFullYear() +
          ' Mensal do Município de ' + 
          this.apiFlask.convertToArray(data.nome_municipio)[0].toString() + ' - ' +
          this.ufSelectedAPI.estado
        );
        switch(this.selectChartOption.value){
          case 0:
            this.chartData = {
              labels: this.apiFlask.convertToArray(data.format_date),
              datasets: [
                {
                  label: 'Média ' + chartLabel,
                  backgroundColor:'#007bff',
                  borderColor: '#55a7ff',
                  data: this.apiFlask.convertToArray(data.media)
                },
                {
                  label: 'Média ' + chartLabelDate,
                  backgroundColor:'#80bdff',
                  borderColor: '#9ecdff',
                  data: this.apiFlask.convertToArray(data.media_ano)
                }
              ]
            };
            break;
          case 2:
            this.chartData = {
              labels: this.apiFlask.convertToArray(data.format_date),
              datasets: [
                {
                  label: 'Máxima ' + chartLabel,
                  backgroundColor: '#007bff',
                  borderColor: '#55a7ff',
                  data: this.apiFlask.convertToArray(data.maxima)
                },
                {
                  label: 'Máxima ' + chartLabelDate,
                  backgroundColor: '#80bdff',
                  borderColor: '#9ecdff',
                  data: this.apiFlask.convertToArray(data.maxima_ano)
                }
              ]
            };
            break;
          default:
            break;
        }
      });
    } else {
      alert("Selecione um Estado e uma Cidade!");
    }
  }

  initDate() {
    this.minDate = new Date();
    this.minDate.setDate(2);
    this.minDate.setMonth(0);
    this.minDate.setFullYear(1998);
    this.maxDate = new Date();
  }

  initLayers() {
    this.layers = [];
    this.layersStatic = [
      new Layer(1, "Estados Brasil Político", "OBT DPI", 'terrama2_10:view10', '4674', this.geoserver20Chuva),
      new Layer(3, "Municípios IBGE", "OBT DPI", 'terrama2_29:view29', '4326', this.geoserver20Chuva)
    ];
    this.layersDynamic = [
      new Layer(4, "Preciptação", "OBT DPI", 'terrama2_3:view3','4326', this.geoserver20Chuva),
      new Layer(5, "Dados Climatológicos", "OBT DPI", 'terrama2_15:view15','4326', this.geoserver20Chuva),
      new Layer(6, "Análise Mensal 1998 - 2019", "OBT DPI", 'terrama2_28:view28','4326', this.geoserver20Chuva)
    ];
    this.layers = this.layers.concat(this.layersStatic);
    this.layers = this.layers.concat(this.layersDynamic);
    this.wmsService.upDate(this.layers[3].getTileLayer(),this.merge_date);
    this.wmsService.upDate(this.layers[4].getTileLayer(),this.monthly_date);
  }

  initState(){
    this.apiFlask.getStates().subscribe( (data:State) => {
      this.ufsAPI = this.apiFlask.convertToStateAPI(this.apiFlask.convertToArray(data.estado),this.apiFlask.convertToArray(data.uf));
    });
  }

  initilizeMapG(){
    this.mapG = new Map({
      controls: [new FullScreen()],
      layers: [
        new TileLayer({
          preload: Infinity,
          visible: true,
          title: "osm",
          baseLayer: true,
          source: new OSM(),
          layer: 'osm',
        })
      ],
      target: 'mapG',
      view: new View({
        center: [-6124801.2015023, -1780692.0106836],
        zoom: 4
      })
    });
  }

  initilizeMap() {
    var mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326', /** 3857 */
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });

    var viewMap = new View({
      center: [-6124801.2015023, -1780692.0106836],
      zoom: 4
    });

    this.map = new Map({
      controls: defaultControls().extend([mousePositionControl, new FullScreen(), new DragRotateAndZoom(), new DragAndDrop()], new ScaleLine({units: 'degrees'})),
      layers: this.features,
      target: 'map',
      view: viewMap
    });

    this.map.on('click', function(event){
      this.mouseCoordinate = olProj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
    });

    var layersWMS = this.layers;
    this.map.on('singleclick', function(event){
      document.getElementById('info').innerHTML = '';
      var viewResolution = viewMap.getResolution();
      var viewProjection = viewMap.getProjection();
      for( let layer of layersWMS ){
        if( layer.checked ){
          var url = layer.getTileLayer().getSource().getGetFeatureInfoUrl(
            event.coordinate, viewResolution, viewProjection,
            "EPSG:4326",
            { 'INFO_FORMAT' : 'text/javascript', 'propertyName' : 'formal_en' }
          );
        }
      }
      if(url){
        document.getElementById('info').innerHTML = '<iframe id = "infoFrame" seamless src = "' + url + '"></iframe>';
      }
    });

    var mapAuxiliar = this.map;
    this.map.on('pointermove', function(event){
      if( event.dragging ){
        return true;
      }
      var pixel = mapAuxiliar.getEventPixel(event.originalEvent);
      var hit = mapAuxiliar.forEachLayerAtPixel(pixel, function(){
        return true;
      });
      mapAuxiliar.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    function changeMap() { }
    this.baseLayers.setBaseLayers(this.setMap);
  }

  initilizeJson() {
    var tileLayers = []
    for( let ind in this.layers ){ tileLayers[ind] = this.layers[ind].getTileLayer() }
    this.features = this.baseLayers.getBaseLayers().concat(tileLayers);
  }

  initilizeMenu(){
    this.items = [
      {
        label: 'Dados Estáticos',
        icon: 'pi pi-pw pi-file',
        items: []
      },
      {
        label: 'Dados Dinâmicos',
        icon: 'pi pi-pw pi-file',
        items: []
      },
      {
        label: 'Opções',
        icon: 'pi pi-pw pi-file',
        items: [
          {
            label: 'Análises',
            icon: 'pi pi-pw pi-file'
          }
        ]
      }
    ];
  }

  private setLayerType(){
    for ( let layer of this.layers ){
      layer.getTileLayer().setVisible(layer.checked);
      layer.getTileLayer().setOpacity(layer.opacidade/100);
    }
  }

  private setLayerTime(){
    for ( let layer of this.layers ){
      this.wmsService.upDate(layer.getTileLayer(),layer.date);
    }
  }

  setLayerTimeAnalysis() {
    this.wmsService.upDateMonth(this.layers[3].getTileLayer(),this.merge_date);
    this.wmsService.upDateMonth(this.layers[4].getTileLayer(),this.monthly_date);
  }

  private setMapType() {
    this.baseLayers.setBaseLayers(this.setMap);
  }

  private legenda(featuresLayer, featuresGeoserver){
    var url = featuresGeoserver + "REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&legend_options=forceLabels:on&LAYER={{LAYER_NAME}}&STYLE={{STYLE_NAME}}"
    url = url.replace('{{LAYER_NAME}}', featuresLayer);
    url = url.replace('{{STYLE_NAME}}', featuresLayer + '_style');
    if(url){
      var parser = new GeoJSON();
      document.getElementById('legenda').innerHTML = '<iframe allowfullscreen height = "800" src = ' + url + '></iframe>';
    }
  }

  private salvar(){
    var group = this.map.getLayerGroup();
    var gruplayers = group.getLayers();
    var layers = this.map.getLayers().getArray();
    for (var i = 5; i < layers.length; i++) {
      var element = gruplayers.item(i);
      var name = element.get('title');
    }
  }

  private setViewMap() {
    let cord = [this.citySelectedAPI.longitude, this.citySelectedAPI.latitude];
    this.mapG.setView(new View({
      center: cord, zoom: 12, projection: 'EPSG:4326'
    }));
    this.map.setView(new View({
      center: cord, zoom: 12, projection: 'EPSG:4326'
    }));
  }

  private configSelectDataGrafico(){
    this.citiesAPI = [];
    this.apiFlask.getCities(this.ufSelectedAPI.uf).subscribe( (data: CityByState) => {
      this.citiesAPI = this.apiFlask.convertToCityAPI(
        this.apiFlask.convertToArray(data.nome1),
        this.apiFlask.convertToArray(data.longitude),
        this.apiFlask.convertToArray(data.latitude),
        this.apiFlask.convertToArray(data.geocodigo)
      );
    });
  }

  activeLayer(index){
    for( let feature of this.features ){ feature.setZIndex(0); }
    this.features[index].setZIndex(1);
  }

  dellLayer(){
    for ( let layer of this.layers ){
      this.map.removeLayer(layer);
    }
  }
}
