export class Layers {
    layername: string
    name: string
    source_type: number
    uri: string
    workspace: string

    constructor(layername: string, name: string, source_type: number, uri: string, workspace: string) {
        this.layername = layername;
        this.name = name;
        this.source_type = source_type;
        this.uri = uri;
        this.workspace = workspace;
    }
}
