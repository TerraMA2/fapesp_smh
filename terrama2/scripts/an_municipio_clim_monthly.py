dias = {1:31,2:0,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31}
an_mes = get_analysis_date().month
ano = get_analysis_date().year
bissexto = None

if ano % 4 == 0:
	if ano % 100 == 0:
	    if ano % 400 == 0: bissexto = True
	    else: bissexto = False
	else: bissexto = True
else: bissexto = False
if bissexto: dias[2] = 29
else: dias[2] = 28

maxima = grid.zonal.max("monthly", 0)
media = grid.zonal.mean("monthly", 0)

if dias[an_mes] == get_analysis_date().day:
    add_value("maxima", maxima)
    add_value("media", media)