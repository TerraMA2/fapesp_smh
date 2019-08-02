import { Injectable } from '@angular/core';

import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

// Model Entity
import { Layers } from 'src/app/entity/layers';

@Injectable({
  providedIn: 'root'
})
export class WmsService {

  private features;

  constructor() { }

  // camadas(Layers) {

  //   this.features = new TileLayer({
  //     title: Layers.name,
  //     source: new TileWMS({
  //       url: Layers.url,
  //       params: {
  //         'LAYERS': Layers.paramsLayer,
  //         'VERSION': '1.1.1',
  //         'FORMAT': 'image/png',
  //         'EPSG': Layers.paramsEPSG,
  //         'TILED': true
  //       },
  //       projection: Layers.paramsEPSG,
  //       serverType: 'geoserver',
  //       name: Layers.name
  //     })
  //   });
  //   this.features.setVisible(false);
  //   this.features.setOpacity(0.50);
  //   return this.features;
  // }

  camadas(Layers) {

    this.features = new TileLayer({
      title: Layers.name,
      source: new TileWMS({
        url: Layers.uri.replace("admin:geoserver@", "") + "/wms?",
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
    // this.features.setOpacity(0.50);
    return this.features;
  }


}
