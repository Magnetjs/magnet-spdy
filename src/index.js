import Base from 'magnet-core/dist/base';
import Koa from 'koa';
import https from 'spdy';
import http from 'http';
import convert from 'koa-convert';
import enforceHttps from 'koa-sslify';
import le from 'letsencrypt-express';
import merge from 'lodash/merge';
import defaultConfig from './config/spdy'

let LEX = le.testing();

export default class SPDY extends Base {
  async setup() {
    // Setup Koa
    // TODO: Maybe move to own module?
    this.app.application = new Koa();
    this.app.application.on('error', (err) => {
      this.log.error(err);
    });

    this.serverConfig = merge(defaultConfig, this.config.server, this.config.spdy);

    if (this.serverConfig.letsEncrypt.enable) {
      let LEX;

      if (this.serverConfig.letsEncrypt.testing) {
        LEX = le.testing();
      } else {
        LEX = le;
      }

      let lex = LEX.create({
        configDir: this.serverConfig.letsEncrypt.configDir,
        approveRegistration: (hostname, cb) => { // leave `null` to disable automatic registration
          // Note: this is the place to check your database to get the user associated with this domain
          cb(null, {
            domains: [hostname],
            email: this.serverConfig.letsEncrypt.email,
            agreeTos: true
          });
        }
      });

      if (this.serverConfig.enforceHttps.enable) {
        this.app.application.use(convert(enforceHttps(this.serverConfig.enforceHttps.options)));
      }

      /**
      * Create server
      */
      this.app.server = https.createServer(Object.assign(lex.httpsOptions, this.serverConfig), LEX.createAcmeResponder(lex, this.app.application.callback()));
      this.redirectServer = http.createServer(LEX.createAcmeResponder(lex, this.app.application.callback()));
    } else {
      this.app.server = https.createServer(this.serverConfig, this.app.application.callback());
    }
  }

  /**
   * Start SPDY server
   */
  async start() {
    this.app.runnable = this.app.server.listen(this.serverConfig.port);
    this.app.redirectServer = this.app.server.listen(8080);

    this.log.info(`Server started at port ${this.serverConfig.port}`);
  }
}
