#!/bin/bash

root=$(pwd)

yarn upgrade @huolala-tech/page-spy@latest

cp "${root}/node_modules/@huolala-tech/page-spy/dist/web/index.min.js" "${root}/public/sdk/index.min.js"

yarn build

# zip -r build.zip "${root}/build"

tar -czvf build.tar.gz "build"
