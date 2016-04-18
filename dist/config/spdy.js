'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  port: 3000,

  letsEncrypt: {
    enable: true,
    testing: false,
    email: 'user@example.com',
    configDir: './letsencrypt.config'
  }
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
//# sourceMappingURL=spdy.js.map