maxima = grid.zonal.max("daily", 0)
media = grid.zonal.mean("daily", 0)
add_value("maxima", maxima)
add_value("media", media)