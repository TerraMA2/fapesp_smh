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
// import Feature from 'ol/Feature';
// import Point from 'ol/geom/Point';
// import Select from 'ol/interaction/Select';
// import { Icon, Style, Stroke } from 'ol/style';
// import { mapToMapExpression } from '@angular/compiler/src/render3/util';

// service
import { MapService } from 'src/app/services/map.service';
import { WmsService } from 'src/app/services/wms.service';
import { AnaliseDadosService } from 'src/app/services/analise-dados.service';
import { MunicipioService } from 'src/app/services/municipio.service';

// Model Entity
import { Layers } from 'src/app/entity/layers';

// Enum
import { RepositoryApi } from 'src/app/enuns/repository-api.enum';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map;
  private merge4km;
  private PrecMedia_Bacias_N1;
  private waterColor;
  private toner;
  private osm;
  // private gebco;
  private terrain;

  value: number = 0;
  val1: number = 100;
  testep: boolean = false;
  public features = [];
  private jsonObj: Layers[];
  setMap: string = 'osm';
  private data;


  private modelLayer = [
    // new Layers(1, 'Municipio_Ibge', 'TerraMA2', this.geoserverTerraMaCurso, 'terrama2_9:view9', '4326'),
    // new Layers(2, 'PrecMedia_Bacias_N1', 'TerraMA2', this.geoserverTerraMaCurso, 'terrama2_11:view11', '4326'),
    // new Layers(3, 'Merge4km', 'TerraMA2', this.geoserverTerraMaCurso, 'terrama2_3:view3', '4326'),
    // new Layers(5, 'EstadoIbge', 'TerraMA2', this.geoserverTerraMaCurso, 'terrama2_10:view10', '4326'),
    // new Layers(4, 'PCDs', 'TerraMA2', this.geoserverTerraMaLocal, 'terrama2_1:view1', '4326')
  ];


  constructor(private mapService: MapService, private wmsService: WmsService, private analiseService: AnaliseDadosService,
    private municipioService: MunicipioService) {

  }

  ngOnInit() {
    this.initLayer();
    this.initDataAgora();
    this.initilizeMap();
  }

  ngDocheck() {

  }

  ngAfterContentInit() {
  }

  initDataAgora() {
    var dataNow = new Date(Math.round(Date.now() / 3600000) * 3600000 - 3600000 * 3);
    var dia = dataNow.getDate();
    var mes = dataNow.getMonth();
    var ano = dataNow.getFullYear();
    this.data = ano + '-' + mes + '-' + dia
  }


  initilizeMap() {

    let interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 100) {
        this.value = 100;
        this.testep = true;
        // this.messageService.add({severity: 'info', summary: 'Success', detail: 'Process Completed'});
        clearInterval(interval);
      } else if (this.value >= 10) {
        // this.map.addLayer(this.pcd);
      } else if (this.value >= 5) {
        // this.map.addLayer(this.prec4km);
      } else if (this.value >= 2) {
        // this.map.addLayer(this.estado);
        // this.map.addLayer(this.baciashidrografica);
      }
    }, 2000);


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

    // this.gebco = new TileLayer({
    //   source: new TileWMS(({
    //     preload: Infinity,
    //     visible: false,
    //     title: "gebco",
    //     baseLayer: true,
    //     url: 'http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
    //     params: { 'LAYERS': 'GEBCO_LATEST', 'VERSION': '1.1.1', 'FORMAT': 'image/png' }
    //   })),
    //   serverType: 'mapserver'
    // });

    this.waterColor = new TileLayer(
      {
        preload: Infinity,
        visible: false,
        title: "Watercolor",
        baseLayer: true,
        source: new Stamen({
          layer: 'watercolor'
        })
      });


    this.toner = new TileLayer(
      {
        preload: Infinity,
        title: "Toner",
        baseLayer: true,
        visible: false,
        source: new Stamen({
          layer: 'toner'
        })
      });


    this.terrain = new TileLayer(
      {
        preload: Infinity,
        title: "terrain",
        baseLayer: true,
        visible: false,
        source: new Stamen({
          layer: 'terrain'
        })
      });

    var center = [-6124801.2015823, -1780692.0106836];
    var view = new View({
      center: center,
      zoom: 4,
      // projection: 'EPSG:4326'
    });

    // var layers = [this.osm, this.gebco, this.waterColor, this.toner, this.terrain];
    var layers = [this.osm, this.waterColor, this.toner, this.terrain];

    this.map = new Map({
      target: 'map',
      layers: layers,
      // interactions: [interaction],
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
        { 'INFO_FORMAT': 'text/javascript', 'propertyName': 'formal_en' });

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

  // private setLayerType(featuresLayer) {
  //   console.log(this.val1 / 100);
  //   console.log(featuresLayer);
  //   if (this.features[featuresLayer].getVisible() == true) {
  //     this.features[featuresLayer].setVisible(false);
  //   } else {
  //     this.features[featuresLayer].setVisible(true);
  //   }
  // }

  private setLayerType2(featuresLayer) {
    if (this.features[featuresLayer.name].getVisible() == true) {
      this.features[featuresLayer.name].setVisible(false);
    } else {
      this.features[featuresLayer.name].setVisible(true);
    }
  }


  initLayer() {
    this.mapService.listar(RepositoryApi.smh_api + "/viewslayer").toPromise()
      .then((data: any) => {
        this.jsonObj = data;
        data.forEach(element => {
          console.log(element.name)
          console.log(element.uri.substring(23) + "/wms?")
          console.log(element.uri.replace("admin:geoserver@", "") + "/wms?")
          this.features[element.name] = this.wmsService.camadas(element);
          this.map.addLayer(this.features[element.name]);
        });
      });
  }

  // private initAddlayer() {
  //   console.log("iniciado")
  //   console.log(this.jsonObj)
  //   this.jsonObj.forEach(element => {
  //     console.log(element)
  //     this.features[element.name] = this.wmsService.camadas(element);
  //     this.map.addLayer(this.features[element.name]);
  //     this.mapG.addLayer(this.features[element.name]);
  //   });
  // }

  private setMapType() {
    switch (this.setMap) {
      case 'osm':
        this.osm.setVisible(true); this.waterColor.setVisible(false); this.toner.setVisible(false); this.terrain.setVisible(false);
        break;
      case 'GEBCO':
        this.osm.setVisible(false); this.waterColor.setVisible(false); this.toner.setVisible(false); this.terrain.setVisible(false);
        break;
      case 'Watercolor':
        this.osm.setVisible(false); this.waterColor.setVisible(true); this.toner.setVisible(false); this.terrain.setVisible(false);
        break;
      case 'Toner':
        this.osm.setVisible(false); this.waterColor.setVisible(false); this.toner.setVisible(true); this.terrain.setVisible(false);
        break;
      case 'Terrain':
        this.osm.setVisible(false); this.waterColor.setVisible(false); this.toner.setVisible(false); this.terrain.setVisible(true);
        break;
    }
  }

  private salvar() {
    // var group = this.map.getLayerGroup();
    // var gruplayers = group.getLayers();
    // var layers = this.map.getLayers().getArray();
    // for (var i = 5; i < layers.length; i++) {
    //   var element = gruplayers.item(i);
    //   var name = element.get('title');
    // }

    // if (this.selectedCity == null) {
    //   this.map.setView(new View({
    //     center: [-6124801.2015823, -1780692.0106836], zoom: 4
    //   }));
    // } else {
    //   this.map.setView(new View({
    //     center: [this.selectedCity.latitude, this.selectedCity.longitude], zoom: 11, projection: 'EPSG:4326'
    //   }));
    // }
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
      // this.features[featuresLayer].setZIndex("");
    }
  }

  private activeLayer2(featuresLayer) {
    console.log(featuresLayer);
  }

  defaultMap() {
    this.map.setView(new View({
      center: [-6124801.2015823, -1780692.0106836], zoom: 4
    }));
  }

  dellLayer() {
    this.map.removeLayer(this.merge4km);
    this.map.removeLayer(this.PrecMedia_Bacias_N1);
  }
}
