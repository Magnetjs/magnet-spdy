'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('magnet-core/dist/base');

var _base2 = _interopRequireDefault(_base);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _spdy = require('spdy');

var _spdy2 = _interopRequireDefault(_spdy);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaSslify = require('koa-sslify');

var _koaSslify2 = _interopRequireDefault(_koaSslify);

var _letsencryptExpress = require('letsencrypt-express');

var _letsencryptExpress2 = _interopRequireDefault(_letsencryptExpress);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _spdy3 = require('./config/spdy');

var _spdy4 = _interopRequireDefault(_spdy3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LEX = _letsencryptExpress2.default.testing();

var SPDY = function (_Base) {
  _inherits(SPDY, _Base);

  function SPDY() {
    _classCallCheck(this, SPDY);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SPDY).apply(this, arguments));
  }

  _createClass(SPDY, [{
    key: 'setup',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var LEX, lex;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Setup Koa
                // TODO: Maybe move to own module?
                this.app.application = new _koa2.default();
                this.app.application.on('error', function (err) {
                  _this2.log.error(err);
                });

                this.serverConfig = (0, _merge2.default)(_spdy4.default, this.config.server, this.config.spdy);

                LEX = void 0;


                if (this.serverConfig.testing) {
                  LEX = _letsencryptExpress2.default.testing();
                } else {
                  LEX = _letsencryptExpress2.default;
                }

                lex = LEX.create({
                  configDir: this.serverConfig.letsEncrypt.configDir,
                  approveRegistration: function approveRegistration(hostname, cb) {
                    // leave `null` to disable automatic registration
                    // Note: this is the place to check your database to get the user associated with this domain
                    cb(null, {
                      domains: [hostname],
                      email: _this2.serverConfig.letsEncrypt.email,
                      agreeTos: true
                    });
                  }
                });


                if (this.serverConfig.enforceHttps.enable) {
                  this.app.application.use((0, _koaConvert2.default)((0, _koaSslify2.default)(this.serverConfig.enforceHttps.options)));
                }

                /**
                 * Create server
                 */
                this.app.server = _spdy2.default.createServer(Object.assign(lex.httpsOptions, this.serverConfig), LEX.createAcmeResponder(lex, this.app.application.callback()));
                this.redirectServer = _http2.default.createServer(LEX.createAcmeResponder(lex, this.app.application.callback()));

                // this.app.server = https.createServer(this.serverConfig, this.app.application.callback());
                // var server = https.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, app.callback()));

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setup() {
        return ref.apply(this, arguments);
      }

      return setup;
    }()

    /**
     * Start SPDY server
     */

  }, {
    key: 'start',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.app.runnable = this.app.server.listen(this.serverConfig.port);
                this.app.redirectServer = this.app.server.listen(8080);

                this.log.info('Server started at port ' + this.serverConfig.port);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function start() {
        return ref.apply(this, arguments);
      }

      return start;
    }()
  }]);

  return SPDY;
}(_base2.default);

exports.default = SPDY;