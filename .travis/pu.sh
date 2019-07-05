#!/bin/bash

jq -c '.version = "$newVersion"' --arg newVersion $1 package.json > temp.$$.json && mv temp.$$.json package.json

echo "bumped package version to " $1
