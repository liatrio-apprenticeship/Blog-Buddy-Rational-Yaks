FROM centos:7
#WORKING DIRECTORY
WORKDIR /working_dir
ADD sqlite_run_scripts.sh /working_dir
RUN yum -y update \
    && yum -y install wget \
    && yum -y install unzip \
    && wget https://www.sqlite.org/2021/sqlite-tools-linux-x86-3340100.zip \
    && unzip /working_dir/sqlite-tools-linux-x86-3340100.zip \
    && mv sqlite-tools-linux-x86-3340100 sqlite \
    && rm sqlite-tools-linux-x86-3340100.zip \
    # Install python for scripting db/table creation in mysql
    && yum install -y python3 \
    #Non-privileged user
    && adduser appuser \
    && groupadd appgroup \
    && usermod -a -G appgroup appuser
USER appuser
ENTRYPOINT [ "./sqlite_run_scripts.sh" ]
