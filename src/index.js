import Base from 'magnet-core/dist/base';
import Koa from 'koa';
import spdy from 'spdy';
import defaultConfig from './config/spdy'

export default class SPDY extends Base {
  async setup() {
    // Setup Koa
    // TODO: Maybe move to own module?
    this.app.application = new Koa();
    this.app.application.on('error', (err) => {
      this.log.error(err);
    });

    this.serverConfig = Object.assign(defaultConfig, this.config.server, this.config.spdy);

    /**
     * Create server
     */
    this.app.server = spdy.createServer(this.serverConfig, this.app.application.callback());
  }

  /**
   * Start SPDY server
   */
  async start() {
    this.app.runnable = this.app.server.listen(this.serverConfig.port);

    this.log.info(`Server started at port ${this.serverConfig.port}`);
  }
}
