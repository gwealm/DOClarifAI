# Docker Compose environment variables

This folder is used to store environment variables for the standalone Compose project.

In this folder, you will find a file named `standalone.example.env`.
This file contains the environment variables that are used by the service and the default values should work out of the box, given you are running the required containers already.

> [!IMPORTANT]  
> To access the host machine from within the containers, you need to use the `host.docker.internal` hostname.

Before running the Compose project, you need to copy the `standalone.example.env` file to the `standalone.env` file and edit it to suit your needs.

> [!NOTE]
> The `.env` file is ignored by Git, so you can safely edit it without worrying about accidentally committing it.
> Furthermore, to create this `standalone.env` file, you can run the `init-env.sh` script in this folder.
