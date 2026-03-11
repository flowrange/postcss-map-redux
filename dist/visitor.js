'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _reduceFunctionCall = require('reduce-function-call');

var _reduceFunctionCall2 = _interopRequireDefault(_reduceFunctionCall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

const reMap = /((?:map)\()(.*)(\))/;

class Visitor {
  constructor(opts = {}, maps = {}) {
    this.opts = opts;
    this.maps = maps;
  }

  /**
   * Parse and replace maps in declarations values.
   * @param {Object} decl
   */
  processDecl(decl) {
    if (!reMap.test(decl.value)) {
      return;
    }

    decl.value = (0, _reduceFunctionCall2.default)(decl.value, 'map', body => {
      return this.getValue(_postcss.list.comma(body));
    });
  }

  /**
   * Parse and proccess at-rules.
   * @param {Object} rule
   */
  processAtRule(rule) {
    if (rule.name === 'map') {
      return this.replaceAtRuleBlock(rule);
    }
    if (reMap.test(rule.params)) {
      return this.replaceAtRuleParam(rule);
    }
  }

  /**
   * Get and print at-rules map declarations.
   * @param {Object} rule
   */
  replaceAtRuleBlock(rule) {
    let map = this.getValue(_postcss.list.space(rule.params));

    Object.keys(map).forEach(prop => {
      rule.parent.insertBefore(rule, { prop, value: map[prop] });
    });

    rule.remove();
  }

  /**
   * Parse and replace maps in at-rules parameters.
   * @param {Object} rule
   */
  replaceAtRuleParam(rule) {
    rule.params = (0, _reduceFunctionCall2.default)(rule.params, 'map', body => {
      return this.getValue(_postcss.list.comma(body));
    });
  }

  /**
   * Get value from a deep nested object properties.
   * @param {Array} args
   * @return {*}
   */
  getValue(args) {
    var _args = _toArray(args);

    let name = _args[0],
        props = _args.slice(1);

    let shortcutMap = this.useShortcutMap(name);

    if (shortcutMap) {
      name = shortcutMap;
      props = args;
    }

    let value = props.reduce((acc, prop) => acc[prop], this.maps[name]);

    if (!reMap.test(value)) {
      return value;
    }

    return (0, _reduceFunctionCall2.default)(value, 'map', body => {
      return this.getValue(_postcss.list.comma(body));
    });
  }

  /**
   * Get map name usable with the short syntax.
   * @param {String} name
   * @return {Boolean|String}
   */
  useShortcutMap(name) {
    if (name in this.maps) {
      return false;
    }
    if (this.opts.defaultMap in this.maps) {
      return this.opts.defaultMap;
    }
    let names = Object.keys(this.maps);
    if (names.length === 1) {
      return names[0];
    }
  }
}
exports.default = Visitor;