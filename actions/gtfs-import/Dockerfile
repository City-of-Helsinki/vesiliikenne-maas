FROM alpine:3.10
RUN apk update && apk add --no-cache bash make unzip jq git curl postgresql-client
RUN mkdir /work
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
