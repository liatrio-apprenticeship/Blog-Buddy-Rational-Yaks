#!/bin/bash
#rm /home/node/sqlite_setup_fldr/blog.db 2> /dev/null

echo "-------------- 1\n"

pip3 install sqlalchemy
pip3 install slackclient 

# Create the database 'blog.db'
python3 create_db.py

# Setup the 'blogs' table
cd ../bot_vol
echo "-------------- 2\n"
ls
python3 sqlite_setup.py

#cd ../bot_vol
#cd /home/node/bot_vol

#ls
#cd ..
#echo "----\n"
#ls

# Populate the database
cd ../sqlite_setup_fldr
sqlite3  -separator "," -cmd ".import blogbuddy.csv blogs" /home/node/sqlite/blog.db | echo ".quit"