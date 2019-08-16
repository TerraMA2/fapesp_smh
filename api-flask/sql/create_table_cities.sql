CREATE TABLE public.municipios_brasil
(
    fid bigint NOT NULL,
    fid_1 bigint,
    sprarea double precision,
    geocodigo character varying(7) COLLATE pg_catalog."default",
    nome1 character varying(33) COLLATE pg_catalog."default",
    uf character varying(2) COLLATE pg_catalog."default",
    id_uf character varying(2) COLLATE pg_catalog."default",
    regiao character varying(12) COLLATE pg_catalog."default",
    mesoregiao character varying(34) COLLATE pg_catalog."default",
    microregia character varying(36) COLLATE pg_catalog."default",
    latitude double precision,
    longitude double precision,
    sede character varying(7) COLLATE pg_catalog."default",
    ogr_geometry geometry(MultiPolygon,4618),
    CONSTRAINT municipios_brasil_fid_pk PRIMARY KEY (fid)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.municipios_brasil
    OWNER to chuva;

-- Index: municipios_brasil_ogr_geometry_idx

-- DROP INDEX public.municipios_brasil_ogr_geometry_idx;

CREATE INDEX municipios_brasil_ogr_geometry_idx
    ON public.municipios_brasil USING gist
    (ogr_geometry)
    TABLESPACE pg_default;