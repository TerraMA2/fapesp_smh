CREATE TABLE public.an_municipio_merge_monthly
(
    fid bigint,
    execution_date timestamp(3) with time zone,
    maxima double precision,
    media double precision,
    mes text COLLATE pg_catalog."default",
    pid_an_municipio_merge_monthly integer NOT NULL DEFAULT nextval('an_municipio_merge_monthly_pid_an_municipio_merge_monthly_seq'::regclass),
    CONSTRAINT an_municipio_merge_monthly_pk PRIMARY KEY (pid_an_municipio_merge_monthly)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.an_municipio_merge_monthly
    OWNER to chuva;