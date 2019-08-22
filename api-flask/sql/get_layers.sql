SELECT layer.id, layer.name AS layername, workspace, uri, view.name, view.source_type
FROM terrama2.layers layer
INNER JOIN terrama2.registered_views register_view ON layer.registered_view_id = register_view.id 
INNER JOIN terrama2.views view ON register_view.view_id = view.id;