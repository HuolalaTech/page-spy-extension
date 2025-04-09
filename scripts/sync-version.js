import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();

const pkg = JSON.parse(
  fs.readFileSync(path.resolve(root, 'package.json'), 'utf8')
);

const manifestPath = path.resolve(root, 'public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

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
