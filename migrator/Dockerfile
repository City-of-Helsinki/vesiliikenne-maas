FROM postgres:12

RUN apt-get update && apt-get install -y build-essential unzip jq git curl

COPY migrate.sh /usr/local/bin/

ENTRYPOINT ["migrate.sh"]
