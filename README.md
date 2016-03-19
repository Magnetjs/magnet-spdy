magnet-spdy
===========

[![Build Status](https://travis-ci.org/Magnetjs/magnet-spdy.svg?branch=master)](https://travis-ci.org/Magnetjs/magnet-spdy)

### Usage
Basic
```
import magnet from 'magnet-core';
import Config from 'magnet-config';
import Logger from 'magnet-bunyan';
import Server from 'magnet-spdy';

let app = await magnet([Config, Logger, Server]);
// Server running at default port 3000
```
server/config/spdy.js
```
import fs from 'fs';

export default {
  key: fs.readFileSync(__dirname + '/keys/localhost.key', 'utf-8'),
  cert: fs.readFileSync(__dirname + '/keys/localhost.crt', 'utf-8')
};
```
Config please refer [node-spdy](https://github.com/indutny/node-spdy)

### TODO
- Add letsencrypt
