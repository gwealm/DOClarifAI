#!/bin/sh

set -e

ENV_FILE="env/standalone.env"

run_compose_without_env() {
    docker compose \
        -f compose.base.yml \
        -f compose.standalone.yml \
        $@
}

run_compose() {
    if [ -f "$ENV_FILE" ]; then
        run_compose_without_env --env-file "$ENV_FILE" $@
    else
        run_compose_without_env $@
    fi
}

run_compose up importer-tests --build
