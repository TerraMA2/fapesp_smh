FROM python:3
COPY . /api_flask
WORKDIR /api_flask
RUN apt-get update
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
CMD python3 manager.py run