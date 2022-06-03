const { writeFileSync, readFileSync } = require('fs');
const { normalize } = require('path');
const { execSync } = require("child_process");

// Copy migrations to build/migrations
execSync('cpx migrations/* build/migrations');

// Create build/package.json
const { dependencies } = JSON.parse(readFileSync('package.json', 'utf8'));
const packageJSON = {
  scripts: {
    postinstall: 'npm run migrate up',
    start: 'node server.js',
    migrate: 'node-pg-migrate'
  },
  dependencies
};
writeFileSync(normalize('build/package.json'), JSON.stringify(packageJSON, null, 2), 'utf8');