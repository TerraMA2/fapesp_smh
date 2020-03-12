import urllib, json

meses = {1:'January',2:'February',3:'March',4:'April',5:'May',6:'June',7:'July',8:'August',9:'September',10:'October',11:'November',12:'December'}
an_mes = get_analysis_date().month
dia = get_analysis_date().day

maxima = grid.zonal.max("daily", 0)
media = grid.zonal.mean("daily", 0)
mes = meses[an_mes]

response = urllib.urlopen("http://150.163.17.142:5000/clim-daily-by-city/" + get_value("geocodigo")  + "/" + mes + "/" + str(dia))
data = json.loads(response.read().decode())
merge_media = data["media"]["0"]

if merge_media: anomalia = media - merge_media
else: anomalia = 0

add_value("maxima", maxima)
add_value("media", media)
add_value("anomalia", anomalia)