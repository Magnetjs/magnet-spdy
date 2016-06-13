import Base from 'magnet-core/dist/base';
import https from 'spdy';
import le from 'letsencrypt-express';
import merge from 'lodash/merge';
import defaultConfig from './config/spdy'

export default class SPDY extends Base {
  async setup() {
    let httpsOptions;
    let responder;
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

      httpsOptions = lex.httpsOptions;
      responder = LEX.createAcmeResponder(lex, this.app.application.callback());
    } else {
      httpsOptions = this.serverConfig;
      responder = this.app.application.callback();
    }

    /**
    * Create server
    */
    this.app.server = https.createServer(httpsOptions, responder);
  }

  /**
   * Start SPDY server
   */
  async start() {
    let ctx = this;
    this.app.server = this.app.server.listen(this.serverConfig.port, function() {
      ctx.log.info(`Server started at port ${this.address().port}`);
    });
  }
}
