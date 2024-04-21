## Common

Common functionality to be shared between services.

## How to use

Creating a Python virtual environment:

```sh
python3 -m venv .venv
source .venv/bin/activate
# Make sure you are at the base repository
cd common
pip install -e .
```

To have IntelliSense in VScode set the active Python interpreter to the one in the `.venv`.


## How to use in a Dockerfile


- In the docker compose create an **additional_context**
```yml
version: '....'    
services:
  my_service:
    build:
      context: ./
      additional_contexts:
         common: <path_to_common_folder>
      dockerfile: .....
```
- In the docker file copy the `common` folder and run `pip install`

```Dockerfile
COPY --from=common . <path-inside-container>
RUN pip install <path-inside-container>
```

## API 

```
├── config.py
├── crud
│   └── postgres
│       └── users.py
├── deps.py
├── models
│   ├── tokens.py
│   └── users.py
├── mongo.py
├── postgres.py
└── security.py
```