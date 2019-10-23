SELECT municipio.nome1 AS nome_municipio, clim_daily.maxima, clim_daily.media,
EXTRACT(DAY FROM clim_daily.execution_date) AS dia,
TRIM(TO_CHAR(clim_daily.execution_date, 'Month')) AS mes,
clim_daily.execution_date
FROM public.municipios_brasil municipio, public.an_municipio_clim_daily clim_daily
WHERE municipio.geocodigo = '{geocodigo}'
AND UPPER(TRIM(TO_CHAR(clim_daily.execution_date, 'Month'))) = UPPER('{mes}')
AND EXTRACT(DAY FROM clim_daily.execution_date) = {dia}
AND municipio.fid = clim_daily.fid
ORDER BY clim_daily.execution_date;