#!/bin/bash

rm /working_dir/blog.db 2> /dev/null

# Setup the 'blogs' table
python3 sqlite_setup.py

# Populate the database
sqlite3  -separator "," -cmd ".import blogbuddy.csv blogs" /working_dir/sqlite/blog.db | echo ".quit"

#python3 sqlite_slack.py