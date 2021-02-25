FROM centos/python-38-centos7:latest AS builder
WORKDIR /home/node/sqlite_setup_fldr/
USER root
COPY sqlite_setup_fldr/ /home/node/sqlite_setup_fldr/
COPY bot_vol/ /home/node/bot_vol/
COPY sqlite_vol/ /home/node/sqlite/

RUN pip3 install sqlalchemy \
    && python3 create_db.py \
    # Setup the 'blogs' table
    && cd ../bot_vol \
    && python3 sqlite_setup.py \
    # Populate the database
    && cd ../sqlite_setup_fldr \
    && sqlite3  -separator "," -cmd ".import blogbuddy.csv blogs" /home/node/sqlite/blog.db | echo ".quit"

FROM centos/nodejs-10-centos7:latest
WORKDIR /home/node/bot_vol
USER root
COPY --from=builder /home/node/sqlite/ /home/node/sqlite/
COPY --from=builder /home/node/bot_vol /home/node/bot_vol/
RUN yum install -y python3 \
    && pip3 install --upgrade pip \
    && pip3 install sqlalchemy \
    && pip3 install slack_sdk \
    && pip3 install flask
EXPOSE 3000

ENTRYPOINT [ "./npm_script.sh" ]

#ENTRYPOINT [ "tail", "-f", "/dev/null" ]
