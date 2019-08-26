ng build
cp Dockerfile dist/SMH-UI
docker build -t smh-ui:latest dist/SMH-UI
docker container run --name app-smh-ui -d -p 8082:8080 smh-ui:latest