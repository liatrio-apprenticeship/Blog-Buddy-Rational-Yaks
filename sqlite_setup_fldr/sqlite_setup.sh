#!/bin/bash

# Create the database 'blog.db'
python3 create_db.py

# Setup the 'blogs' table
cd ../bot_vol
python3 sqlite_setup.py

# Populate the database
cd ../sqlite_setup_fldr
sqlite3  -separator "," -cmd ".import blogbuddy.csv blogs" /home/node/sqlite/blog.db | echo ".quit"
