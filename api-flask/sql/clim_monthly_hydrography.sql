SELECT bacias.ps1_nm AS nome_bacia, clim_monthly.maxima, clim_monthly.media, TRIM(TO_CHAR(clim_monthly.execution_date, 'Month')) as mes
FROM public.geoft_pnrh_sub1 bacias, public.an_bacias_clim_monthly clim_monthly
WHERE bacias.ps1_cd = '{codigo}'
AND UPPER(TRIM(TO_CHAR(clim_monthly.execution_date, 'Month'))) = UPPER('{mes}')
AND bacias.gid = clim_monthly.gid
ORDER BY clim_monthly.execution_date;
