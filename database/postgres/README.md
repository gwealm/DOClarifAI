# Database - Postgres

## Overview

This module is responsible for handling database interactions within our system. 

## Prerequisites

Before using this module, ensure the following prerequisites are met:

- Docker is installed on your system.
- Docker Compose is installed on your system.

If this is not the case, you can follow this links to proceed with the installation of both:
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Usage

2. Go to the `env` directory

    ```bash
    cd env
    ```

3. Run the `init-env` script to setup the environment variables 


    ```bash
    ./init-env.sh
    ```
    Note: For further information you can read [this](./env/README.md)

4. Go the parent directory and run the `run_standalone` script

    ```bash
    ./run_standalone.sh
    ```
