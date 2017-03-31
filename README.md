magnet-spdy
===========

[![Greenkeeper badge](https://badges.greenkeeper.io/Magnetjs/magnet-spdy.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/Magnetjs/magnet-spdy.svg?branch=master)](https://travis-ci.org/Magnetjs/magnet-spdy)

### Usage
Basic
```
import magnet from 'magnet-core';
import Config from 'magnet-config';
import Logger from 'magnet-bunyan';
import Koa from 'magnet-koa';
import Server from 'magnet-spdy';

let app = await magnet([
  [Koa, Config],
  Logger,
  Server
]);
// Server running at default port 3000
```
server/config/spdy.js
```
export default {
  port: 3000,

  // https://github.com/turboMaCk/koa-sslify#available-options
  enforceHttps: {
    enable: true,
    options: {}
  },

  // Experimental
  letsEncrypt: {
    enable: true,
    testing: false,
    email: 'user@example.com',
    configDir: './letsencrypt.config',
  },

  redirectServer: {
    enable: true,
    port: 8080
  },
};

// // Without letsencrypt
// import fs from 'fs';
// export default {
//   port: 1337,
//
//   ssl: {
//     key: fs.readFileSync(__dirname + '/keys/localhost.key', 'utf-8'),
//     cert: fs.readFileSync(__dirname + '/keys/localhost.crt', 'utf-8')
//   }
// };

```
Config please refer [node-spdy](https://github.com/indutny/node-spdy)

### TODO
- Add letsencrypt
