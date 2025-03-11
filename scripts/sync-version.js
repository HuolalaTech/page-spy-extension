const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkg = require(path.resolve(__dirname, '../package.json'));

const manifestPath = path.resolve(__dirname, '../public/manifest.json');
const manifest = require(manifestPath);

manifest.version = pkg.version;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

try {
  execSync('git add public/manifest.json');
  execSync(`git commit --amend --no-edit`);
  console.log('✨ Synced version and amended commit');
} catch (error) {
  console.error('Failed to amend commit:', error.message);
  process.exit(1);
}
