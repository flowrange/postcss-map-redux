# postcss-map

A quick PostCss 8 compatible fork of [postcss-map](https://github.com/pascalduez/postcss-map).

> [PostCSS] plugin enabling configuration maps.

## Installation

```
npm install postcss-map --save-dev
```

or

```
yarn add postcss-map --save-dev
```

## Usage

```js
const fs = require('fs');
const postcss = require('postcss');
const map = require('postcss-map');

let input = fs.readFileSync('input.css', 'utf8');

let opts = {
  basePath: 'css',
  maps: ['example.yml', 'breakpoints.yml', 'fonts.yml'],
};

postcss()
  .use(map(opts))
  .process(input)
  .then(result => {
    fs.writeFileSync('output.css', result.css);
  });
```

### Example usage from declaration values

map:

```yaml
# example.yml
foo:
  bar:
    baz: 'yeah!'
```

input:

```css
.baz {
  content: map(example, foo, bar, baz);
}
```

output:

```css
.baz {
  content: 'yeah!';
}
```

### Example usage from at-rules parameters

map:

```yaml
# breakpoints.yml
small: 320px
medium: 321px
large: 800px
```

input:

```css
@media (min-width: map(breakpoints, medium)) {
  .test {
    width: 100%;
  }
}
```

output:

```css
@media (min-width: 321px) {
  .test {
    width: 100%;
  }
}
```

### Example from declaration blocks

map:

```yaml
# fonts.yml
regular:
  font-family: "'Spinnaker Regular', sans-serif"
  font-weight: 'normal'
  font-feature-settings: "'onum', 'kern', 'liga', 'dlig', 'clig'"
  font-kerning: 'normal'
bold:
  font-family: "'Spinnaker Bold', sans-serif"
  font-weight: 'normal'
  font-feature-settings: "'onum', 'kern', 'liga', 'dlig', 'clig'"
  font-kerning: 'normal'
```

input:

```css
.whatever {
  @map fonts regular;
}
```

output:

```css
.whatever {
  font-family: 'Spinnaker Regular', sans-serif;
  font-weight: normal;
  font-feature-settings: 'onum', 'kern', 'liga', 'dlig', 'clig';
  font-kerning: normal;
}
```

### Example usage with literal objects

```js
const fs = require('fs');
const postcss = require('postcss');
const map = require('postcss-map');

let input = fs.readFileSync('input.css', 'utf8');

let opts = {
  basePath: 'css',
  maps: [
    {
      dummy: {
        one: 1,
        two: 2,
      },
    },
    'example.yml',
    'breakpoints.yml',
    'fonts.yml'
  }]
};

postcss()
  .use(map(opts))
  .process(input)
  .then(result => {
    fs.writeFileSync('output.css', result.css);
  });
```

input:

```css
.whatever {
  content: map(dummy, one);
}

.baz {
  content: map(example, foo, bar, baz);
}
```

output:

```css
.whatever {
  content: 1;
}

.baz {
  content: 'yeah!';
}
```

### Example usage with literal objects and short syntax

```js
const fs = require('fs');
const postcss = require('postcss');
const map = require('postcss-map');

let input = fs.readFileSync('input.css', 'utf8');

let opts = {
  maps: [
    {
      one: 1,
      two: 2,
    },
  ],
};

postcss()
  .use(map(opts))
  .process(input)
  .then(result => {
    fs.writeFileSync('output.css', result.css);
  });
```

input:

```css
.whatever {
  content: map(one);
}
```

output:

```css
.whatever {
  content: 1;
}
```

## Options

### basePath

type: `String`
default: `process.cwd`
Base path to retrieve maps from.

### maps

type: `Array`
default: `[]`
An array representing maps files to load and parse.
Map files can either be in YAML or JSON format.
You can also pass literal objects directly into the Array.

### defaultMap (short syntax)

type: `string`
default: `config`

A shorter syntax is also available, so you don't have to type the map name on each call. To enable it you need to either have a map called `config` or only one map in your settings.

```js
let opts = {
  basePath: 'css',
  maps: ['foo.yml']
  // OR
  maps: ['config.yml', 'breakpoints.yml']
};
```

map:

```yaml
# config.yml
foo: 'foo value'
```

input:

```css
.short {
  content: map(foo);
}
```

output:

```css
.short {
  content: 'foo value';
}
```

## Context

Used in conjunction with [postcss-plugin-context] you can benefit from contextualized
maps and leverage the short syntax.

```css
@context brandColors {
  h1 {
    color: map(primary);
  }
}
```

## Credits

- [Pascal Duez](https://github.com/pascalduez)
- [Bogdan Chadkin](https://github.com/TrySound)

## Licence

postcss-map is [unlicensed](http://unlicense.org/).

[postcss]: https://github.com/postcss/postcss
[postcss-plugin-context]: https://github.com/postcss/postcss-plugin-context
[npm-url]: https://www.npmjs.org/package/postcss-map
[npm-image]: http://img.shields.io/npm/v/postcss-map.svg?style=flat-square
[travis-url]: https://travis-ci.org/pascalduez/postcss-map?branch=master
[travis-image]: http://img.shields.io/travis/pascalduez/postcss-map.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/pascalduez/postcss-map
[coveralls-image]: https://img.shields.io/coveralls/pascalduez/postcss-map.svg?style=flat-square
[depstat-url]: https://david-dm.org/pascalduez/postcss-map
[depstat-image]: https://david-dm.org/pascalduez/postcss-map.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/postcss-map.svg?style=flat-square
[license-url]: UNLICENSE
