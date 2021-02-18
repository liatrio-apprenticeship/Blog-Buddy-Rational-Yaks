# Image for sqlite setup
FROM centos/python-38-centos7:latest AS sqlite_builder
WORKDIR /working_dir
COPY /sqlite_setup /sqlite_setup
USER root
RUN yum -y update \
    && yum -y install wget \
    && yum -y install unzip \
    # sqlite installation
    && wget https://www.sqlite.org/2021/sqlite-tools-linux-x86-3340100.zip \
    && unzip /working_dir/sqlite-tools-linux-x86-3340100.zip \
    && mv sqlite-tools-linux-x86-3340100 sqlite \
    # sqlite setup
    && cd /sqlite_setup \
    && ./sqlite_setup.sh

# Image for botkit setup
FROM centos:7 AS botkit_builder
WORKDIR /working_dir
# ---- *** BOTKIT SETUP HERE; files you don't need to persist for the final image ----

# Final image
FROM centos/python-38-centos7:latest
WORKDIR /working_dir
USER root
COPY --from=sqlite_builder /working_dir/sqlite ./sqlite
COPY --from=sqlite_builder /opt/app-root/bin/python /opt/app-root/bin/python
# ---- *** BOTKIT ESSENTIALS HERE; Only bring over essentials for botkit into the final image ----
# i.e. COPY --from=botkit_builder /necessary /necessary

RUN pip install --upgrade pip \
    && pip install sqlalchemy


ENTRYPOINT [ "tail", "-f", "/dev/null" ]

# _________________ To Build / Run _________________
# docker build -t sqlite_builder .
# docker run -it sqlite_builder
