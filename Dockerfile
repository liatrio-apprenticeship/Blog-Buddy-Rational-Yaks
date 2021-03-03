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
    && npm install sqlite3 \
    && npm install sqlite-async \
    && python3 sqlite_setup.py \
    # Populate the database
    && cd ../sqlite_setup_fldr \
    && sqlite3  -separator "," -cmd ".import blogbuddy.csv blogs" /home/node/sqlite/blog.db | echo ".quit"

FROM centos/nodejs-10-centos7:latest
WORKDIR /home/node/bot_vol
USER 0
COPY --from=builder /home/node/sqlite/blog.db /home/node/bot_vol/
COPY --from=builder /home/node/bot_vol /home/node/bot_vol/
EXPOSE 3000

ENTRYPOINT [ "./npm_script.sh" ]

