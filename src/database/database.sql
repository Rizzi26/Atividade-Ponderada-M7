CREATE TABLE users (
  id serial PRIMARY KEY,
  username text,
  password text
);

CREATE TABLE predict (
    id serial PRIMARY KEY,
    username_predict text,
    date text,
    forecast bool,
    user_id integer REFERENCES users (id)
);

CREATE TABLE logs (
    id serial PRIMARY KEY,
    date text,
    username_log text,
    action text,
    user_id integer REFERENCES users (id)
);  