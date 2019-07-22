import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS';
import { OSM } from 'ol/source.js';
import Stamen from 'ol/source/Stamen';
export class BaseLayers {
    private baseLayerNames = ["osm", "Watercolor", "Toner", "Terrain", "GEBCO"];
    private allBaseLayers;

    constructor(){
        this.allBaseLayers = {
            "osm" : new TileLayer({
                preload: Infinity,
                visible: false,
                title: "osm",
                baseLayer: true,
                source: new OSM(),
                layer: 'osm',
            }),
            "GEBCO" : new TileLayer({
                source: new TileWMS(({
                    preload: Infinity,
                    visible: false,
                    title: "gebco",
                    baseLayer: true,
                    url: 'http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
                    params: {
                        'LAYERS' : 'GEBCO_LATEST',
                        'VERSION' : '1.1.1',
                        'FORMAT' : 'image/png'
                    }
                })),
                serverType: 'mapserver'
            }),
            "Watercolor" : new TileLayer({
                preload: Infinity,
                visible: false,
                title: "Watercolor",
                baseLayer: true,
                source: new Stamen({
                    layer: 'watercolor'
                })
            }),
            "Toner" : new TileLayer({
                preload: Infinity,
                title: "Toner",
                baseLayer: true,
                visible: false,
                source: new Stamen({
                    layer: 'toner'
                })
            }),
            "Terrain" : new TileLayer({
                preload: Infinity,
                title: "terrain",
                baseLayer: true,
                visible: false,
                source: new Stamen({
                    layer: 'terrain'
                })
            })
        }
    }

    public getBaseLayers(){
        var baseLayers = [];
        for( let i in this.baseLayerNames ){ baseLayers[i] = this.allBaseLayers[this.baseLayerNames[i]]; }
        return baseLayers;
    }

    public setBaseLayers(baseLayer: string){
        for( let name of this.baseLayerNames ){ this.allBaseLayers[name].setVisible(false); }
        this.allBaseLayers[baseLayer].setVisible(true);
    }
}
