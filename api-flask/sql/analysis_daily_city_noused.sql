SELECT
municipio.nome1 AS nome_municipio,
clim_daily.maxima AS maxima,
clim_daily.media AS media,
daily.maxima AS maxima_mes,
daily.media AS media_mes,
daily.anomalia,
daily.execution_date,
EXTRACT(DAY FROM daily.execution_date) AS dia,
TRIM(TO_CHAR(daily.execution_date, 'Month')) AS mes,
EXTRACT(DAY FROM clim_daily.execution_date)
|| ' - ' ||
TRIM(TO_CHAR(clim_daily.execution_date, 'Month'))
|| ' - ' ||
EXTRACT(YEAR FROM clim_daily.execution_date)
AS format_date
FROM public.municipios_brasil municipio, public.an_municipio_clim_daily clim_daily, public.an_municipio_daily daily
WHERE municipio.fid = daily.fid AND municipio.fid = clim_daily.fid
AND EXTRACT(DAY FROM daily.execution_date) = EXTRACT(DAY FROM clim_daily.execution_date)
AND TRIM(TO_CHAR(daily.execution_date, 'Month')) = TRIM(TO_CHAR(clim_daily.execution_date, 'Month'))
AND municipio.geocodigo = '{geocodigo}'
AND daily.execution_date BETWEEN '{ano_inicio}-{mes_inicio}-{dia_inicio} 00:00:00+00'
AND '{ano_fim}-{mes_fim}-{dia_fim} 23:55:55+00'
ORDER BY clim_daily.execution_date;