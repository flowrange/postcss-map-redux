import path from 'path';
import { readFile } from 'fs';
import yaml from 'js-yaml';
import Visitor from './visitor';

const plugin = (opts = {}) => ({
  postcssPlugin: 'postcss-map-redux',
  prepare(_result) {
    opts = Object.assign({
      maps: [],
      basePath: process.cwd(),
      defaultMap: 'config',
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
      return path.resolve(opts.basePath, map);
    });

    let promises = paths.map(map => {
      return new Promise((resolve, reject) => {
        readFile(map, 'utf-8', (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      })
        .then(function (data) {
          let name = path.basename(map, path.extname(map));
          maps[name] = yaml.safeLoad(data, {
            filename: map,
          });
        });
    });

    let visitor = Object.create(null);

    const getVisitor = async () => {
      if (visitor instanceof Visitor) {
        return visitor;
      }

      visitor = await Promise.all(promises).then(() => {
        return new Visitor(opts, maps);
      });

      return visitor;
    };

    const funcs = {
      AtRule: async (rule) => {
        (await getVisitor()).processAtRule(rule);
      },
      Declaration: async (decl) => {
        (await getVisitor()).processDecl(decl);
      },
    };

    return funcs;
  },
});

export default plugin;
