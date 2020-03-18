interface clim {
    clim_maxima: number;
    clim_media: number;
}

interface result {
    date: Date;
    climatologico: clim;
    prec_maxima: number;
    prec_media: number;
    anomalia: number;
}

interface timeline {
    start_date: Date;
    end_date: Date;
}

interface query {
    nome_municipio: string;
    geocodigo: string;
    timeline: timeline;
}

export interface Analysis {
    query: query;
    result: result[];
}