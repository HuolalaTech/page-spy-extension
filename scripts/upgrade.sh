#!/bin/bash

root=$(pwd)

yarn upgrade @huolala-tech/page-spy-browser@latest @huolala-tech/page-spy-plugin-data-harbor@latest @huolala-tech/page-spy-plugin-rrweb@latest

cp "${root}/node_modules/@huolala-tech/page-spy-browser/dist/iife/index.min.js" "${root}/public/sdk/index.min.js"
cp "${root}/node_modules/@huolala-tech/page-spy-plugin-data-harbor/dist/iife/index.min.js" "${root}/public/sdk/plugins/data-harbor.min.js"
cp "${root}/node_modules/@huolala-tech/page-spy-plugin-rrweb/dist/iife/index.min.js" "${root}/public/sdk/plugins/rrweb.min.js"

yarn build

# zip -r build.zip "${root}/build"

tar -czvf build.tar.gz "build"
