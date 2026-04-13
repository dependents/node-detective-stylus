'use strict';

const assert = require('assert').strict;
const { suite } = require('uvu');
const detective = require('../index.js');

function hasDependencies(source, expected) {
  const dependencies = detective(source);
  assert.deepEqual(dependencies, expected);
}

const test = suite('detective-stylus');

test('does not throw for empty files', () => {
  assert.doesNotThrow(() => {
    detective('');
  });
});

test('throws if the given content is not a string', () => {
  assert.throws(() => {
    detective(() => {});
  }, /^Error: content is not a string$/);
});

test('throws if called with no arguments', () => {
  assert.throws(() => {
    detective();
  }, /^Error: content not given$/);
});

test('returns the dependencies of Stylus @import statements', () => {
  hasDependencies('@import "_foo.styl"', ['_foo.styl']);
  hasDependencies('@import "_foo"', ['_foo']);
  hasDependencies('body { color: blue } @import "_foo"', ['_foo']);
  hasDependencies('@import "bar"', ['bar']);
  hasDependencies('@import "_foo.styl";\n@import "_bar.styl"', ['_foo.styl', '_bar.styl']);
  hasDependencies('@import "_foo.styl"\n@import "_bar.styl"\n@import "_baz"\n@import "_buttons"', ['_foo.styl', '_bar.styl', '_baz', '_buttons']);
});

test('returns the dependencies of Stylus @require statements', () => {
  hasDependencies('@require \'bar\';', ['bar']);
  hasDependencies('@require \'bar.styl\';', ['bar.styl']);
});

test.run();
