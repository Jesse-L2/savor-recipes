import pandas as pd
import numpy as np
import psycopg2
from sqlalchemy import create_engine

DB = 'recipes'
USER = 'postgres'
PASS = 'password123'
HOST = '127.0.0.1'
PORT = '5432'

# df = pd.read_csv('recipes.csv', low_memory=False)
# print(df.head(20))

# df.loc[index] allows referencing a particular index
# print(df.loc[4])

'''cleaned_df = pd.read_csv('cleaned_recipes.csv')
cleaned_df = cleaned_df.dropna(axis=0, how='any')
cleaned_df = cleaned_df[cleaned_df.Images != 'character(0)']
cleaned_df = cleaned_df[cleaned_df.ReviewCount >= 3]

cleaned_df.to_csv('cleaned_recipes_final.csv')'''


# estbalish db connection
df = pd.read_csv('cleaned_recipes_final.csv')
conn_string = f'postgresql://{USER}:{PASS}@{HOST}/{DB}'

db = create_engine(conn_string)
conn = db.connect()

pg_conn = psycopg2.connect(database=DB,
                         user=USER,
                         password=PASS,
                         host=HOST,
                         port=PORT
                         )
pg_conn.autocommit = True

curs = pg_conn.cursor()





curs.execute('drop table if exists recipes')

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
                                    instructions TEXT);
'''

curs.execute(create_sql_table)
print(df)

df.to_sql('recipes', con=conn, if_exists='replace')

sql1 = '''SELECT * FROM recipes;'''
curs.execute(sql1)


pg_conn.commit()
pg_conn.close()