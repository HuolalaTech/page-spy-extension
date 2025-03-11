const fs = require('fs');
const path = require('path');

const pkg = require(path.resolve(__dirname, '../package.json'));

const manifestPath = path.resolve(__dirname, '../public/manifest.json');
const manifest = require(manifestPath);

manifest.version = pkg.version;

// 写入更新后的 manifest.json
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`✨ Synced version ${pkg.version} to manifest.json`);
