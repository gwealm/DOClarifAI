#!/bin/sh

for file in $(find . -name '*.example.env'); do
    cp "$file" "${file%.example.env}.env"
done