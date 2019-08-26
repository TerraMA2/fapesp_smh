cd api-flask/
docker build -t api-flask:latest .
docker container run --name flask -d -p 5000:5000 api-flask:latest
cd ../SMH-UI
npm install
ng build
cp Dockerfile dist/SMH-UI
docker build -t smh-ui:latest dist/SMH-UI
docker container run --name app-smh-ui -d -p 8082:8080 smh-ui:latest