FROM postgres:latest

COPY ./init-scripts/schema.sql /docker-entrypoint-initdb.d/01_schema.sql

EXPOSE 5432