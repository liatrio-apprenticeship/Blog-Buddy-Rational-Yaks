#!/bin/bash

rm /working_dir/db_csv/blog.db 2> /dev/null

# Create the blog database
cd db_csv
python3 create_db.py
python3 create_table.py
sqlite3  -separator "," -cmd ".import /working_dir/db_csv/blogbuddy.csv blogs" /working_dir/db_csv/blog.db | echo ".quit"

tail -f /dev/null