SELECT municipio.nome1, clim_daily.maxima, clim_daily.media, clim_daily.dia, clim_daily.mes
FROM public.municipios_brasil municipio, public.an_municipio_clim_daily clim_daily
WHERE municipio.geocodigo = '{geocodigo}' AND municipio.fid = clim_daily.fid
ORDER BY execution_date;