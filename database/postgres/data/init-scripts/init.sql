CREATE TABLE user(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    hashed_password VARCHAR(60) NOT NULL
);