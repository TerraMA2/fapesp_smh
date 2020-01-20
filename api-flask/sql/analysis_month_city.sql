SELECT 
municipio.nome1 AS nome_municipio,
(monthly.maxima * EXTRACT(DAY FROM monthly.execution_date)) AS maxima_ano,
(clim_monthly.maxima * EXTRACT(DAY FROM clim_monthly.execution_date)) AS maxima,
(monthly.media * EXTRACT(DAY FROM monthly.execution_date)) AS media_ano,
(clim_monthly.media * EXTRACT(DAY FROM clim_monthly.execution_date)) AS media,
(monthly.anomalia * EXTRACT(DAY FROM clim_monthly.execution_date)) AS anomalia,
EXTRACT(YEAR FROM monthly.execution_date) AS ano,
TRIM(TO_CHAR(monthly.execution_date, 'Month')) AS mes,
TRIM(TO_CHAR(monthly.execution_date, 'Month')) || ' - ' || TO_CHAR(monthly.execution_date, 'YYYY') AS format_date
FROM public.municipios_brasil municipio, public.an_municipio_monthly monthly, public.an_municipio_clim_monthly clim_monthly
WHERE municipio.fid = monthly.fid AND municipio.fid = clim_monthly.fid
AND municipio.geocodigo = '{geocodigo}'
AND monthly.execution_date BETWEEN TO_DATE('{mes_inicio}/{ano_inicio}','MM/YYYY') AND TO_DATE('{mes_fim}/{ano_fim}','MM/YYYY')
AND TO_CHAR(monthly.execution_date, 'Month') = TO_CHAR(clim_monthly.execution_date, 'Month')
ORDER BY monthly.execution_date;