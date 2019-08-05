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
import { CityByStateUnique } from 'src/app/interface/city-by-state-unique';

// Enum
import { UfEnum } from 'src/app/enuns/uf-enum.enum';
import { GraficoEnum } from 'src/app/enuns/grafico-enum.enum';
import { RepositoryApi } from 'src/app/enuns/repository-api.enum';

@Component({
  selector: 'app-analise-mensal',
  templateUrl: './analise-mensal.component.html',
  styleUrls: ['./analise-mensal.component.css']
})
export class AnaliseMensalComponent implements OnInit {

  private mapAnalise;

  private waterColor;
  private toner;
  private terrain;
  private osm;

  private cities: CityByStateUnique[];
  private selectedCity: CityByStateUnique;

  private dataGrafico: any;
  private dataGraficoRes: any;
  private start: Date = new Date(1998,0,31);
  private end: Date = new Date(1998,11,31);
  dados: any[];

  private uf: Uf[] = [{ nomeUf: UfEnum.AC }, { nomeUf: UfEnum.AL }, { nomeUf: UfEnum.AM }, { nomeUf: UfEnum.AP }, { nomeUf: UfEnum.BA },
  { nomeUf: UfEnum.CE }, { nomeUf: UfEnum.DF }, { nomeUf: UfEnum.ES }, { nomeUf: UfEnum.GO }, { nomeUf: UfEnum.MA },
  { nomeUf: UfEnum.MG }, { nomeUf: UfEnum.MS }, { nomeUf: UfEnum.MT }, { nomeUf: UfEnum.PA }, { nomeUf: UfEnum.PB },
  { nomeUf: UfEnum.PE }, { nomeUf: UfEnum.PI }, { nomeUf: UfEnum.PR }, { nomeUf: UfEnum.RJ }, { nomeUf: UfEnum.RN },
  { nomeUf: UfEnum.RO }, { nomeUf: UfEnum.RR }, { nomeUf: UfEnum.RS }, { nomeUf: UfEnum.SC }, { nomeUf: UfEnum.SE },
  { nomeUf: UfEnum.SP }, { nomeUf: UfEnum.TO }];
  private selectedUf: Uf

  private grafico: Grafico[] = [{ nomeGrafico: GraficoEnum.Máxima }, { nomeGrafico: GraficoEnum.Média }, { nomeGrafico: GraficoEnum.Anomalia }, { nomeGrafico: GraficoEnum.Teste }];
  private selectedGrafico: Grafico;

  constructor( private apiFlask: PythonFlaskAPIService, private analiseService: AnaliseDadosService, private municipioService: MunicipioService) { }

  ngOnInit() {
    this.initilizeMap();
  }

  private initilizeMap() {

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



    // var wmsSource = new TileWMS({
    //   url: this.geoserverTerraMaLocal,
    //   params: { 'LAYERS': 'terrama2_1:view1', 'TILED': true },
    //   serverType: 'geoserver',
    //   crossOrigin: 'anonymous'
    // });


    // this.mapAnalise.on('singleclick', function (evt) {

    //   var viewResolution = /** @type {number} */ (view.getResolution());
    //   var viewProjection = /** @type {number} */ (view.getProjection());
    //   var url = wmsSource.getGetFeatureInfoUrl(
    //     evt.coordinate, viewResolution, viewProjection, 'EPSG:4326',
    //     { 'INFO_FORMAT': 'text/javascript', 'propertyName': 'formal_en' });

    //   console.log(url);

    //   if (url) {
    //     var parser = new GeoJSON();
    //     document.getElementById('info').innerHTML =
    //       '<iframe allowfullscreen src="' + url + '"></iframe>';
    //   }
    // });


    function changeMap() {
      console.log('name');
    }
  }


  loadCityByUf() {
    this.cities = [];
    this.apiFlask.getCities(this.selectedUf.nomeUf).toPromise().then((data: any) => {
      this.cities = this.apiFlask.convertToCityAPI(
        data.nome1,data.longitude,data.latitude,data.geocodigo
      );
    });
  }

  // initViewAnalise() {

  //   var geoCod = "3302700";
  //   this.selectedUf = { nomeUf: 'SP' };

  //   var laber = [];
  //   var dat = [];
  //   var dat2 = [];

  //   this.municipioService.listar(this.smt_apiDados + "municipio/" + this.selectedUf.nomeUf + "").toPromise()
  //     .then((data: any) => {
  //       this.cities = data
  //       console.log(data)
  //     });


  //   this.analiseService.listar(this.smt_apiDados + "dados/" + geoCod + "").toPromise()
  //     .then((data: any) => {
  //       data.forEach(element => {
  //         laber.push(element.mes)
  //         dat.push(element.max)
  //         dat2.push(element.maxcli)
  //       });
  //       // console.log(laber)
  //       this.dataGrafico = {
  //         labels: laber,
  //         datasets: [
  //           {
  //             label: 'Valor Maximo',
  //             backgroundColor: '#1a5c8e',
  //             borderColor: '#1E88E5',
  //             data: dat
  //           },
  //           {
  //             label: 'Valor Maximo Climatologico',
  //             backgroundColor: '#2f84ad',
  //             borderColor: '#7CB342',
  //             data: dat2
  //           }
  //         ]
  //       }
  //     });
  // }

  loadAnalise() {
    // console.log(this.selectedCity.geocodigo)
    // this.features["Municipios"].getSource().updateParams({ 'cql_filter': 'uf=' + this.selectedUf.nomeUf + '' });
    // this.features["an_merge_monthly"].getSource().updateParams({ 'cql_filter': 'monitored_geocodigo=' + this.selectedCity.geocodigo + '' });
    // if (this.selectedCity == null) {
    //   this.mapG.setView(new View({
    //     center: [-6124801.2015823, -1780692.0106836], zoom: 4
    //   }));
    // } else {
    //   this.mapG.setView(new View({
    //     center: [this.selectedCity.longitude, this.selectedCity.latitude], zoom: 11, projection: 'EPSG:4326'
    //   }));
    // }

    // if (this.selectedCity == null) {
    //   this.mapAnalise.setView(new View({
    //     center: [-6124801.2015823, -1780692.0106836], zoom: 4
    //   }));
    // } else {
    //   this.mapAnalise.setView(new View({
    //     center: [this.selectedCity.longitude, this.selectedCity.latitude], zoom: 11, projection: 'EPSG:4326'
    //   }));
    // }

    // var url = this.smt_apiDados + "dados/" + this.selectedCity.geocodigo + "";
    // var url2 = this.smt_apiDados + "dadosres/" + this.selectedCity.geocodigo + "";
    // var laber = [];
    // var dat = [];
    // var dat2 = [];

    // var laber2 = [];
    // var dat2_1 = [];
    // var dat2_2 = [];

    // console.log(url2)
    // this.analiseService.listar(RepositoryApi.smh_api + "an_municipio_merge_monthly/" + this.selectedCity.geocodigo + "").toPromise()
    //   .then((data: any) => {
    //     this.dados = data;
    //     data.forEach(element => {
    //       laber.push(element.mes)
    //       dat.push(element.maxima)
    //       dat2.push(element.media)
    //     });
    //     // console.log(laber)
    //     this.dataGrafico = {
    //       labels: laber,
    //       datasets: [
    //         {
    //           label: 'Valor Maximo',
    //           backgroundColor: '#1a5c8e',
    //           borderColor: '#1E88E5',
    //           data: dat
    //         },
    //         {
    //           label: 'Valor Maximo Climatologico',
    //           backgroundColor: '2f84ad',
    //           borderColor: '#7CB342',
    //           data: dat2
    //         }
    //       ]
    //     }
    //   });

      this.apiFlask.getMonthlyMaxMeanDiffLimitDate(this.selectedCity.geocodigo,this.start, this.end).toPromise().then( (data: any) =>  {
        switch(this.selectedGrafico.nomeGrafico) {
          case "Máxima":
            this.dataGrafico = {
              labels: this.apiFlask.convertToArray(data.format_date),
              datasets: [
                {
                  label: "Climatológico",
                  backgroundColor: '#007bff',
                  borderColor: '#55a7ff',
                  data: this.apiFlask.convertToArray(data.maxima)
                },
                {
                  label: "Máxima",
                  backgroundColor: '#80bdff',
                  borderColor: '#9ecdff',
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
                  label: "Climatológico",
                  backgroundColor: '#007bff',
                  borderColor: '#55a7ff',
                  data: this.apiFlask.convertToArray(data.media)
                },
                {
                  label: "Média",
                  backgroundColor: '#80bdff',
                  borderColor: '#9ecdff',
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
                  label: 'Anomalia',
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
      });
    
    // this.analiseService.listar(this.smh_api + "an_municipio_merge_monthly/" + this.selectedCity.geocodigo + "").toPromise()
    //   .then((data: any) => {
    //     data.forEach(element => {
    //       laber2.push(element.mes)
    //       dat2_1.push(element.maxima)
    //       dat2_2.push(element.media)
    //     });
    //     // console.log(laber)
    //     this.dataGraficoRes = {
    //       labels: laber2,
    //       datasets: [
    //         {
    //           label: 'Valor Maximo Resultante',
    //           backgroundColor: '#1a5c8e',
    //           borderColor: '#1E88E5',
    //           data: dat2_1
    //         },
    //         {
    //           label: 'Valor Medio Resultante',
    //           backgroundColor: '#2f84ad',
    //           borderColor: '#7CB342',
    //           data: dat2_2
    //         }
    //       ]
    //     }
    //   });
  }

  private salvar() {
    console.log(this.start);
    console.log(this.end);
  }
}
