const nodeResolve = require('@rollup/plugin-node-resolve').nodeResolve
const commonjs = require('@rollup/plugin-commonjs')
const terser = require('@rollup/plugin-terser')

module.exports = [
  {
    input: './index.js',
    output: {
      file: './extension/flowsight.js',
      format: 'umd',
      name: 'flowSight',
      globals: {
        'fs': 'fs'
      }
    },
    external: [ 'fs' ],
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: 'node_modules/**'
      }),
      //terser(),
    ],
  },
];
