SELECT 
municipio.nome1 as nome_municipio,
monthly.maxima as maxima_ano,
monthly.media as media_ano,
merge_monthly.maxima as maxima,
merge_monthly.media as media,
monthly.ano as ano,
merge_monthly.mes as mes
FROM public.municipios_brasil as municipio, public.an_municipio_monthly monthly, public.an_municipio_merge_monthly merge_monthly
WHERE municipio.fid = monthly.fid AND municipio.fid = merge_monthly.fid
AND monthly.ano = {ano}
AND municipio.geocodigo = '{geocodigo}'
AND monthly.mes = merge_monthly.mes
ORDER BY monthly.execution_date;