FROM postgis/postgis:12-3.0

RUN echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen && \
    echo 'fi_FI.UTF-8 UTF-8' >> /etc/locale.gen && \
    echo 'fi_FI@euro ISO-8859-15 ' >> /etc/locale.gen && \
    /usr/sbin/locale-gen

COPY postgresql.conf /etc/postgresql.conf

CMD ["postgres", "-c", "config_file=/etc/postgresql.conf"]
