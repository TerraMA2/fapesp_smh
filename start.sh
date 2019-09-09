echo " => Criando a imagem api-flask 1/5
    
    "
cd api-flask/
docker build -t api-flask:latest .
echo "
 => Executando o container flask com a imagem gerada api-flask 2/5
    
    "
docker container run --name flask -d -p 5000:5000 api-flask:latest
echo "

 => Criando o projeto angular executável SMH-UI (build) 3/5
    
    "
cd ../SMH-UI
npm install
ng build
echo "

 => Criando uma imagem com o projeto executável SMH-UI 4/5
    
    "
cp Dockerfile dist/SMH-UI
docker build -t smh-ui:latest dist/SMH-UI
echo "

 => Executando o container com a imagem gerada SMH-UI 5/5
    
    "
docker container run --name app-smh-ui -d -p 8080:8080 smh-ui:latest
echo "

 Finalizando OK ;)
 
    API-FLASK => http://150.163.17.142:5000
    SMH-UI => http://150.163.17.142:8080

    "