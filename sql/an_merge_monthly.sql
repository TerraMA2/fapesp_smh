SELECT nome_municipio, maxima, media, mes
FROM public.an_municipio_merge_monthly
WHERE geocodigo = '{geocodigo}'
AND media IS NOT NULL AND maxima IS NOT NULL
ORDER BY execution_date;
