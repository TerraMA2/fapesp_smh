SELECT municipio.nome1 AS nome_municipio, clim_monthly.maxima, clim_monthly.media, TRIM(TO_CHAR(clim_monthly.execution_date, 'Month')) as mes
FROM public.municipios_brasil municipio, public.an_municipio_clim_monthly clim_monthly
WHERE municipio.geocodigo = '{geocodigo}'
AND UPPER(TRIM(TO_CHAR(clim_monthly.execution_date, 'Month'))) = UPPER('{mes}')
AND municipio.fid = clim_monthly.fid
ORDER BY clim_monthly.execution_date;