DROP DATABASE IF EXISTS paste;

CREATE DATABASE paste;

CREATE TABLE IF NOT EXISTS users (
  user_id BIGINT PRIMARY KEY,
  karma INTEGER,
  username TEXT
);
