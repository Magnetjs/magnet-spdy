import test from 'tape';
import Server from '../dist';

(async function () {
  let server = new Server({
    // Inject log
    log: { info: console.log },
    // Inject config
    config: { server: { port: 3000 } }
  });
  await server.setup();
  await server.start();

  test('Start server', function (t) {
    t.ok(!!server.app.application);
    t.ok(!!server.app.server);
    t.end();
  });
})();
