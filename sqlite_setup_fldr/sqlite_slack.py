import os
from slack import WebClient
from flask import Flask, request

client_id = os.environ["SLACK_CLIENT_ID"]
client_secret = os.environ["SLACK_CLIENT_SECRET"]
oauth_scope = os.environ["SLACK_SCOPES"]

app = Flask(__name__)