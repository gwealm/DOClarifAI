# Start from the official MongoDB image
FROM mongo

# Environment variables for MongoDB
ENV MONGO_INITDB_ROOT_USERNAME=admin \
    MONGO_INITDB_ROOT_PASSWORD=secret

# Copy custom MongoDB scripts into the container
COPY ./init-scripts /docker-entrypoint-initdb.d

EXPOSE 27017
