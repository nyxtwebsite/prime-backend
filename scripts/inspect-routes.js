const fs = require('fs');
const path = require('path');

// Let's check node_modules/@payloadcms/next
const routesPath = path.resolve('backend/node_modules/@payloadcms/next/dist/routes/rest/index.js');
if (fs.existsSync(routesPath)) {
  console.log('--- REST routes ---');
  console.log(fs.readFileSync(routesPath, 'utf8').slice(0, 1000));
}

const viewsPath = path.resolve('backend/node_modules/@payloadcms/next/dist/views/Root/index.js');
if (fs.existsSync(viewsPath)) {
  console.log('--- Root View ---');
  console.log(fs.readFileSync(viewsPath, 'utf8').slice(0, 1000));
}
