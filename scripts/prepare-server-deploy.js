const { writeFileSync, readFileSync } = require('fs');
const { copySync, removeSync } = require('fs-extra');
const { normalize, join } = require('path');

console.group('Preparing server deployment');

const start = Date.now();
const DEPLOY_DIR = normalize('server/deploy');

console.log('✅ clear deploy folder');
removeSync('server/deploy');

console.log('✅ copy server build');
copySync('server/build', DEPLOY_DIR);

console.log('✅ copy database migrations');
copySync('server/migrations', join(DEPLOY_DIR, 'migrations'));

console.log('✅ copy admin app to server public folder');
copySync('web-apps/admin/build', join(DEPLOY_DIR, 'public/admin-app'));

console.log('✅ create server package.json');
const { dependencies } = JSON.parse(readFileSync('server/package.json', 'utf8'));
const packageJSON = {
  scripts: {
    postinstall: 'npm run migrate up',
    start: 'node server.js',
    migrate: 'node-pg-migrate'
  },
  dependencies
};
writeFileSync(normalize('server/deploy/package.json'), JSON.stringify(packageJSON, null, 2), 'utf8');

console.log(`✅ done in ${`${Date.now() - start} ms`}`);

console.groupEnd();