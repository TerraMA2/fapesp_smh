import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS';
export class Layers {
  private tileLayer;

  public id = 0;
  public title = "";
  public name = "";
  public fonte = "";
  public url = "";
  public date = new Date();
  public opacidade = 100;
  public checked = false;

  constructor(id: number, title: string, fonte: string, name: string, date: Date, epsg: string, origin: string){
    this.id = id;
    this.title = title;
    this.fonte = fonte;
    this.name = name;
    this.url = origin;
    this.date = date;
    this.tileLayer = new TileLayer({
      title : name,
      visible: this.checked,
      source: new TileWMS({
        url: origin,
        params: {
          'LAYERS': name,
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': epsg,
          'TILED': true,
          'TIME' : '1998-01-02'
        },
        preload: Infinity,
        projection: 'EPSG:'.concat(epsg),
        serverType: 'geoserver',
        name: name
      })
    });
    this.tileLayer.setZIndex(0);
  }

  public setDate(date: Date) {
    this.tileLayer.updateParams({'TIME' : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()});
  }

  public setVisible() {
    this.checked = ! this.checked;
  }
  
  public setTileLayer(tileLayer: TileLayer){
    this.tileLayer = tileLayer;
  }

  public getTileLayer(){
    return this.tileLayer;
  }
}
