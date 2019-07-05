#!/bin/bash

jq -c '.version = "$v"' --arg v $1 package.json > temp.$$.json && mv temp.$$.json package.json

cat temp.$$.json
cat package.json
echo "bumped package version to " $1
