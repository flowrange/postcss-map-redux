'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _visitor = require('./visitor');

var _visitor2 = _interopRequireDefault(_visitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const plugin = (opts = {}) => ({
  postcssPlugin: 'postcss-map-redux',
  prepare(_result) {
    opts = Object.assign({
      maps: [],
      basePath: process.cwd(),
      defaultMap: 'config'
    }, opts);

    let filtered = [];
    let maps = Object.create(null);
    let paths = opts.maps.filter(map => {
      if (typeof map === 'string' && filtered.indexOf(map) === -1) {
        filtered.push(map);
        return true;
      }
      if (typeof map === 'object') {
        Object.assign(maps, map);
      }
    }).map(map => {
      return _path2.default.resolve(opts.basePath, map);
    });

    let promises = paths.map(map => {
      return new Promise((resolve, reject) => {
        (0, _fs.readFile)(map, 'utf-8', (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      }).then(function (data) {
        let name = _path2.default.basename(map, _path2.default.extname(map));
        maps[name] = _jsYaml2.default.safeLoad(data, {
          filename: map
        });
      });
    });

    let visitor = Object.create(null);

    const getVisitor = (() => {
      var _ref = _asyncToGenerator(function* () {
        if (visitor instanceof _visitor2.default) {
          return visitor;
        }

        visitor = yield Promise.all(promises).then(function () {
          return new _visitor2.default(opts, maps);
        });

        return visitor;
      });

      return function getVisitor() {
        return _ref.apply(this, arguments);
      };
    })();

    const funcs = {
      AtRule: (() => {
        var _ref2 = _asyncToGenerator(function* (rule) {
          (yield getVisitor()).processAtRule(rule);
        });

        return function AtRule(_x) {
          return _ref2.apply(this, arguments);
        };
      })(),
      Declaration: (() => {
        var _ref3 = _asyncToGenerator(function* (decl) {
          (yield getVisitor()).processDecl(decl);
        });

        return function Declaration(_x2) {
          return _ref3.apply(this, arguments);
        };
      })()
    };

    return funcs;
  }
});

exports.default = plugin;