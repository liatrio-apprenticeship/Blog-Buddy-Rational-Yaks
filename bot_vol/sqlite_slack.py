import slack
import time
import datetime
import logging
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlite_setup import Blog, Base

# DB Setup variables
engine = create_engine('sqlite:////home/node/sqlite/blog.db')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

