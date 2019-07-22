import { Injectable } from '@angular/core';

import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

// Model Entity
import { Layer } from '../map/tile-layers/layer';

@Injectable({
  providedIn: 'root'
})
export class WmsService {

  private features;

  constructor() { }

  camadas(Layers) {
    this.features = new TileLayer({
      title: Layers.name,
      source: new TileWMS({
        url: "http://localhost:8080/geoserver/wms?",
        params: {
          'LAYERS': Layers.workspace + ":" + Layers.layername,
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': "4326",
          'TILED': true
        },
        projection: "4326",
        serverType: 'geoserver',
        name: Layers.name
      })
    });
    this.features.setVisible(false);
    return this.features;
  }

  private bissexto(ano:number){
    if (ano % 400 == 0){
      return true;
    }
    else {
      if(ano % 4 == 0 && ano % 100 != 0) {
        return true;
      } else {
        return false;
     }
    }
  }

  getRecort(tileLayer:TileLayer, param: string, value:string){
    tileLayer.getSource().updateParams({ 'cql_filter' : (param + '=').concat(value)});
  }

  upDate(tileLayer:TileLayer, date: Date){
    tileLayer.getSource().updateParams({'TIME' : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()});
  }

  upDateMonth(tileLayer:TileLayer, date: Date){
    let data = [31,0,31,30,31,30,31,31,30,31,30,31]
    if ( this.bissexto(date.getFullYear()) ) { data[1] = 29; }
    else { data[1] = 28; } 
    tileLayer.getSource().updateParams({'TIME' : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + data[date.getMonth()]});
  }

  getVerboseMonth(date: Date){
    let meses = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return meses[date.getMonth()];
  }
}
