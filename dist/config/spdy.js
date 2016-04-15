'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  testing: false,

  // https://github.com/turboMaCk/koa-sslify#available-options
  enforceHttps: {
    enable: true,
    options: {}
  },

  letsEncrypt: {
    email: 'user@example.com',
    configDir: './letsencrypt.config'
  },

  port: 3000
};