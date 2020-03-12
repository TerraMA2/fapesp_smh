SELECT nome1 AS nome_municipio, geocodigo, latitude, longitude
FROM public.municipios_brasil
WHERE uf = '{uf}' ORDER BY nome1;
