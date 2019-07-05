#!/bin/bash

jq -c '.version = "'"$0"'"' package.json > temp.$$.json && mv temp.$$.json package.json

cat package.json
echo "bumped package version to " $1
