# Frontend

`Frontend` is supposed to deal with the frontend of our services.

## Prerequisites

Before utilizing this repository, ensure the following software is installed on your system:

- [Docker](https://www.docker.com/get-started)
- [nodejs](https://nodejs.org/en/download/current)
- [npm](https://www.npmjs.com/package/npm)

## Getting Started - Docker

To execute this using docker you just need to build the image:

```bash
docker build -t some_tag:v1.0
```

And then run it:

```bash
docker run -p "8080:8080" some_tag:v1.0
```

You can also run `docker compose up frontend` in the parent directory

## Getting started - Manual Pipeline

### Running the Application

To initiate the application, execute the following setps

This script will launch the application.

### Testing

To execute the tests you just need to run `npm run test`

This will trigger the tests.

Note: note that tests should be placed under `/tests` and follow the proper naming conventions.

## Project Structure

The project structure encompasses the following components:

- `/src/`: Holds the application's source code.
- `/tests/`: Contains the tests for the application.

Note: for more information about the structure of the project you should get familiar with [Vite](https://vitejs.dev/)

## Formatting

To format the code, run `npm run prettier`.
