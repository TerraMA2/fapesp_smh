import { Component, OnInit } from '@angular/core';
//OpenLayer
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import TileWMS from 'ol/source/TileWMS';
// import Vector from 'ol/source/Vector';
import Stamen from 'ol/source/Stamen';
import GeoJSON from 'ol/format/GeoJSON';
import FullScreen from 'ol/control/FullScreen';
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom';
// service
import { MapService } from 'src/app/services/map.service';
import { WmsService } from 'src/app/services/wms.service';
import { AnaliseDadosService } from 'src/app/services/analise-dados.service';
import { MunicipioService } from 'src/app/services/municipio.service';
// Model Entity
import { Layers } from 'src/app/entity/layers';
import { BaseLayers } from 'src/app/entity/base-layers';
// Enum
import { RepositoryApi } from 'src/app/enums/repository-api.enum';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map;
  private waterColor;
  private toner;
  private osm;
  private terrain;

  value: number = 0;
  val1: number = 100;
  testep: boolean = false;
  public features = [];
  private jsonObj: Layers[];
  setMap: string = 'osm';
  private data;
  private baseLayers = new BaseLayers();

  private modelLayer = [
    new Layers(1, "Análise do Acumulado Mensal","OBT-DPI","terrama2_16:view16", new Date(31,0,1998),"4326",RepositoryApi.geoserverTerraMaLocal)
  ];


  constructor(private mapService: MapService, private wmsService: WmsService, private analiseService: AnaliseDadosService,
    private municipioService: MunicipioService) {

  }

  ngOnInit() {
    this.initilizeMap();
  }

  initilizeMap() {
    var interaction = new DragRotateAndZoom();
    var control = new FullScreen();
    var center = [-6124801.2015823, -1780692.0106836];
    var view = new View({
      center: center,
      zoom: 4
    });
    this.map = new Map({
      target: 'map',
      layers: this.baseLayers.getBaseLayers(),
      controls: [control],
      view: view
    });
    this.map.on('singleclick', function (evt) {
      console.log(evt.pixel);
    });
    var wmsSource = new TileWMS({
      url: RepositoryApi.geoserverTerraMaLocal,
      params: { 'LAYERS': 'terrama2_1:view1', 'TILED': true },
      serverType: 'geoserver',
      crossOrigin: 'anonymous'
    });
    this.map.on('singleclick', function (evt) {
      var viewResolution = /** @type {number} */ (view.getResolution());
      var viewProjection = /** @type {number} */ (view.getProjection());
      var url = wmsSource.getGetFeatureInfoUrl(
        evt.coordinate, viewResolution, viewProjection, 'EPSG:4326',
        { 'INFO_FORMAT': 'text/javascript', 'propertyName': 'formal_en' }
      );
      console.log(url);
      if (url) {
        var parser = new GeoJSON();
        document.getElementById('info').innerHTML =
          '<iframe allowfullscreen src="' + url + '"></iframe>';
      }
    });
    function changeMap() {
      console.log('name');
    }
    this.baseLayers.setBaseLayers(this.setMap);
  }


  private legenda(featuresLayer, featuresGeoserver) {
    var url = RepositoryApi.geoserverTerraMaLocal + "REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&legend_options=forceLabels:on&LAYER={{LAYER_NAME}}&STYLE={{STYLE_NAME}}";
    url = url.replace('{{LAYER_NAME}}', featuresLayer.workspace + ":" + featuresLayer.layername);
    url = url.replace('{{STYLE_NAME}}', featuresLayer.workspace + ":" + featuresLayer.layername + '_style');
    if (url) {
      var parser = new GeoJSON();
      document.getElementById('info').innerHTML =
        '<iframe allowfullscreen height="800" src="' + url + '"></iframe>';
    }
  }

  private setMapType() {
    this.baseLayers.setBaseLayers(this.setMap);
  }

  private activeLayer(featuresLayer) {
    var group = this.map.getLayerGroup();
    var gruplayers = group.getLayers();
    var layers = this.map.getLayers().getArray();
    for (var i = 5; i < layers.length; i++) {
      var element = gruplayers.item(i);
      var name = element.get('title');
      this.features[name].setZIndex(0);
    }
    if (this.features[featuresLayer.name].getZIndex() == null || this.features[featuresLayer.name].getZIndex() == "") {
      console.log(featuresLayer.name);
      this.features[featuresLayer.name].setZIndex(1);
    } else {
    }
  }

  defaultMap() {
    this.map.setView(new View({
      center: [-6124801.2015823, -1780692.0106836], zoom: 4
    }));
  }
}
