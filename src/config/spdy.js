export default {
  port: 3000,

  // https://github.com/turboMaCk/koa-sslify#available-options
  enforceHttps: {
    enable: true,
    options: {}
  },

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
