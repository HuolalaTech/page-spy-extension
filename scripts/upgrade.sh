#!/bin/bash

root=$(pwd)
huolalaTechScope="${root}/node_modules/@huolala-tech"

yarn upgrade -P "@huolala-tech/*" --L

# Build online-page-spy
mkdir -p "${root}/public/sdk/plugins"
cp "${huolalaTechScope}/page-spy-browser/dist/iife/index.min.js" "${root}/public/sdk/index.min.js"
cp "${huolalaTechScope}/page-spy-plugin-data-harbor/dist/iife/index.min.js" "${root}/public/sdk/plugins/data-harbor.min.js"
cp "${huolalaTechScope}/page-spy-plugin-rrweb/dist/iife/index.min.js" "${root}/public/sdk/plugins/rrweb.min.js"
yarn build