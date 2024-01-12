#!/bin/bash

root=$(pwd)

yarn upgrade @huolala-tech/page-spy-browser@latest

cp "${root}/node_modules/@huolala-tech/page-spy-browser/dist/iife/index.min.js" "${root}/public/sdk/index.min.js"

yarn build

# zip -r build.zip "${root}/build"

tar -czvf build.tar.gz "build"
