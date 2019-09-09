SELECT municipio.nome1, merge_monthly.maxima, merge_monthly.media, merge_monthly.mes
FROM public.municipios_brasil municipio, public.an_municipio_merge_monthly merge_monthly
WHERE municipio.geocodigo = '{geocodigo}' AND mes = '{mes}' AND municipio.fid = merge_monthly.fid
ORDER BY execution_date;