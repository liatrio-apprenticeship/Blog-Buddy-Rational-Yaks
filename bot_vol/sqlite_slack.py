import slack_sdk
import sqlalchemy
import time
import datetime
import logging
import sys
from slack_sdk import WebClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlite_setup import Blog, Base

def get_latest_ts_from_db():
    """
    Get the latest TS in the database
    :return: the TS object with the latest time stamp
    """
    obj = session.query(Blog).order_by(Blog.title.asc())
    return obj

def post_message(slack_client, mychannel):
    # The database string
    end_send = ""

    # For each row from the obj returned by get_latest_ts_from_db(), print the title and link
    for instance in get_latest_ts_from_db():
        end_send += str(instance.title) + " - " + str(instance.link_liatrio) + "\n"

    # Post the message to slack, append the formatted results
    slack_client.chat_postMessage(
        channel='#' + mychannel,
        text="Dumping database\n" + end_send
        )

# DB Setup variables
engine = create_engine('sqlite:////home/node/sqlite/blog.db')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

logging.basicConfig()
slack_client = WebClient(token="YOUR_TOKEN_HERE")

id = None
mychannel = 'yaks-devops-test-channel'
list = slack_client.conversations_list()
for each in list.data.get('channels'):
    if each.get('name') == mychannel:
        id = each.get('id')

# For testing looping; set to 1 for just 1 message per script run
repeat = 1

while repeat != 0:
    post_message(slack_client, mychannel)
    repeat = repeat - 1;
        