import urllib, json
meses = {1:'January',2:'February',3:'March',4:'April',5:'May',6:'June',7:'July',8:'August',9:'September',10:'October',11:'November',12:'December'}
dias = {1:31,2:0,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31}
an_mes = get_analysis_date().month
ano = get_analysis_date().year
mes = meses[an_mes]
bissexto = None

if ano % 4 == 0:
	if ano % 100 == 0:
	    if ano % 400 == 0: bissexto = True
	    else: bissexto = False
	else: bissexto = True
else: bissexto = False
if bissexto: dias[2] = 29
else: dias[2] = 28

maxima = grid.zonal.max("monthly")
media = grid.zonal.mean("monthly")

if int(dias[an_mes]) == int(get_analysis_date().day):

    response = urllib.urlopen("http://150.163.17.142:5000/clim-monthly-by-city/" + get_value("geocodigo")  + "/" + mes)
    data = json.loads(response.read().decode())
    merge_media = data["media"]["0"]

    if merge_media: anomalia = media - merge_media
    else: anomalia = 0

    add_value("maxima", maxima)
    add_value("media", media)
    add_value("anomalia", anomalia)