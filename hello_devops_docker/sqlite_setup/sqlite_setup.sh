#!/bin/bash

rm /working_dir/blog.db 2> /dev/null

# Create the blog database
python3 create_db.py
python3 create_table.py
sqlite3  -separator "," -cmd ".import blogbuddy.csv blogs" /working_dir/sqlite/blog.db | echo ".quit"
