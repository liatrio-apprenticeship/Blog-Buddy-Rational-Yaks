FROM centos/nodejs-10-centos7:latest
WORKDIR /working_dir
USER root
COPY sqlite_setup_fldr/create_db.py sqlite_setup_fldr/
RUN yum -y update \
    && yum -y install wget \
    && yum -y install unzip \
    # sqlite installation
    && wget https://www.sqlite.org/2021/sqlite-tools-linux-x86-3340100.zip \
    && unzip /working_dir/sqlite-tools-linux-x86-3340100.zip \
    && mv sqlite-tools-linux-x86-3340100 sqlite \
    # create database
    && cd sqlite_setup_fldr \
    && yum install -y python3 \
    && python3 create_db.py

FROM centos/nodejs-10-centos7:latest
WORKDIR /working_dir
COPY sqlite_setup_fldr/ scripts/
COPY --from=builder /working_dir/sqlite/ sqlite/
USER root
EXPOSE 3000
RUN yum install -y python3 \
    && pip3 install --upgrade pip \
    && pip3 install sqlalchemy \
    && pip3 install slackclient \
    && cd scripts \
    && ./sqlite_setup.sh \
    # non-privileged user
    && adduser appuser \
    && groupadd appgroup \
    && usermod -a -G appgroup appuser

WORKDIR /working_dir/bot_vol

ENTRYPOINT [ "bash", "./npm_script.sh"]
