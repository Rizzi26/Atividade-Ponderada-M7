Table user {
  id integer [primary key]
  user text
  password text
}

Table predict {
  id integer [primary key]
  date timestamp
  user_id integer REFERENCES users (id)
}