#!/bin/bash

root=$(pwd)
huolalaTechScope="${root}/node_modules/@huolala-tech"
onlinePackage="${root}/packages/online-pagespy-extension"

yarn upgrade @huolala-tech/page-spy-browser@latest @huolala-tech/page-spy-plugin-data-harbor@latest @huolala-tech/page-spy-plugin-rrweb@latest

# Build online-page-spy
cd "${onlinePackage}" || exit
mkdir -p "${onlinePackage}/public/sdk/plugins"
cp "${huolalaTechScope}/page-spy-browser/dist/iife/index.min.js" "${onlinePackage}/public/sdk/index.min.js"
cp "${huolalaTechScope}/page-spy-plugin-data-harbor/dist/iife/index.min.js" "${onlinePackage}/public/sdk/plugins/data-harbor.min.js"
cp "${huolalaTechScope}/page-spy-plugin-rrweb/dist/iife/index.min.js" "${onlinePackage}/public/sdk/plugins/rrweb.min.js"
yarn build
tar -czvf dist.tar.gz "dist"
zip -r dist.zip dist