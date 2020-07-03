FROM postgis/postgis:12-3.0
RUN apt-get update && apt-get install -y build-essential unzip jq git curl
RUN mkdir /work
COPY run-inside-container.sh routes-query.sql /work/
