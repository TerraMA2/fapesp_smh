SELECT municipio.nome1, clim_monthly.maxima, clim_monthly.media, clim_monthly.mes
FROM public.municipios_brasil municipio, public.an_municipio_clim_monthly clim_monthly
WHERE municipio.geocodigo = '{geocodigo}' AND mes = '{mes}' AND municipio.fid = clim_monthly.fid
ORDER BY execution_date;