SELECT municipio.nome1 as nome_municipio, clim_daily.maxima, clim_daily.media, clim_daily.dia, clim_daily.mes, clim_daily.execution_date
FROM public.municipios_brasil municipio, public.an_municipio_clim_daily clim_daily
WHERE municipio.geocodigo = '{geocodigo}'
AND clim_daily.execution_date
BETWEEN '{ano_inicio}-{mes_inicio}-{dia_inicio} 00:00:00+00'
AND '{ano_fim}-{mes_fim}-{dia_fim} 23:55:55+00'
AND municipio.fid = clim_daily.fid
ORDER BY clim_daily.execution_date;
