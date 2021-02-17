# Adapted from: https://www.sqlitetutorial.net/sqlite-python/create-tables/
import sqlite3
from sqlite3 import Error


def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return conn


def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
        conn.commit()
    except Error as e:
        print(e)


def main():
    database = r"/working_dir/db_csv/blog.db"

    sql_create_blogs_table = """CREATE TABLE IF NOT EXISTS blogs (
                                    kickoff text,
                                    author text,
                                    title text PRIMARY KEY,
                                    summary text,
                                    target_level_1 text,
                                    target_func_1 text,
                                    target_level_2 text,
                                    target_func_2 text,
                                    liatrio_service_conn text,
                                    link text
                                );"""

    # create a database connection
    conn = create_connection(database)

    # create tables
    if conn is not None:
        # create blogs table
        create_table(conn, sql_create_blogs_table)
    else:
        print("Error! Cannot create the database connection.")


if __name__ == '__main__':
    main()
