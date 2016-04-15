import Base from 'magnet-core/dist/base';
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
      if (this.serverConfig.redirectServer.enable) {
        this.app.redirectServer = http.createServer(LEX.createAcmeResponder(lex, this.app.application.callback()));
      }
    } else {
      this.app.server = https.createServer(this.serverConfig.ssl, this.app.application.callback());
    }
  }

  /**
   * Start SPDY server
   */
  async start() {
    let ctx = this;
    this.app.runnable = this.app.server.listen(this.serverConfig.port, function() {
      ctx.log.info(`Server started at port ${this.address().port}`);
    });

    if (this.serverConfig.redirectServer.enable) {
      this.app.runnableRedirectServer = this.app.redirectServer.listen(this.serverConfig.redirectServerPort, function() {
        ctx.log.info(`Redirecting insecure traffic from ${this.address().port} to https`);
      });
    }
  }
}
