export default {
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

  port: 3000,
};
