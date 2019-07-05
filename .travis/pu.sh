#!/bin/bash

jq -c '.version = "$v"' --arg v $1 package.json > temp.$$.json && mv temp.$$.json package.json

echo temp.$$.json
echo package.json
echo "bumped package version to " $1
