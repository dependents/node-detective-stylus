/* eslint-env mocha */

'use strict';

const assert = require('assert');
const detective = require('../index.js');

function hasDependencies(source, expected) {
  const dependencies = detective(source);
  assert.deepEqual(dependencies, expected);
}

describe('detective-stylus', () => {
  it('does not throw for empty files', () => {
    assert.doesNotThrow(() => {
      detective('');
    });
  });

  it('throws if the given content is not a string', () => {
    assert.throws(() => {
      detective(() => {});
    }, Error, 'content is not a string');
  });

  it('throws if called with no arguments', () => {
    assert.throws(() => {
      detective();
    }, Error, 'src not given');
  });

  it('returns the dependencies of Stylus @import statements', () => {
    hasDependencies('@import "_foo.styl"', ['_foo.styl']);
    hasDependencies('@import "_foo"', ['_foo']);
    hasDependencies('body { color: blue } @import "_foo"', ['_foo']);
    hasDependencies('@import "bar"', ['bar']);
    hasDependencies('@import "_foo.styl";\n@import "_bar.styl"', ['_foo.styl', '_bar.styl']);
    hasDependencies('@import "_foo.styl"\n@import "_bar.styl"\n@import "_baz"\n@import "_buttons"', ['_foo.styl', '_bar.styl', '_baz', '_buttons']);
  });

  it('returns the dependencies of Stylus @require statements', () => {
    hasDependencies('@require \'bar\';', ['bar']);
    hasDependencies('@require \'bar.styl\';', ['bar.styl']);
  });
});
