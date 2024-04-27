#!/bin/sh

set -e

run_compose() {
    docker compose \
        -f compose.base.yml \
        $@
}

run_compose up frontend -d --build --remove-orphans
run_compose logs frontend -f 