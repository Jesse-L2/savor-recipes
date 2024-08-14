import os
import pandas as pd
import numpy as np
import psycopg2
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Load environment variables from .env file
load_dotenv()

DB = os.getenv('DB')
USER = os.getenv('USER')
PASS = os.getenv('PASS')
HOST = os.getenv('HOST')
PORT = os.getenv('PORT')

df = pd.read_csv('recipes_data.csv')
conn_string = f'postgresql://{USER}:{PASS}@{HOST}/{DB}'

db = create_engine(conn_string)
conn = db.connect()

pg_conn = psycopg2.connect(database=DB,
                             user=USER,
                             password=PASS,
                             host=HOST,
                             port=PORT)
pg_conn.autocommit = True

curs = pg_conn.cursor()

# create table if not exists
create_sql_table = '''
CREATE TABLE IF NOT EXISTS recipes (recipe_id integer,
                                    recipe_name VARCHAR(150),
                                    author_id integer,
                                    author_name VARCHAR(100),
                                    total_time VARCHAR(100),
                                    image TEXT,
                                    ingredients_quantity TEXT,
                                    ingredients TEXT,
                                    review_avg numeric,
                                    review_count integer,
                                    servings numeric,
                                    instructions TEXT
);
'''
curs.execute(create_sql_table)

# insert data into the table
df.to_sql('recipes', con=conn, if_exists='replace', index=False)
print(df)

sql1 = '''SELECT * FROM recipes;'''
curs.execute(sql1)

pg_conn.commit()
pg_conn.close()