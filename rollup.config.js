import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';

// watch -> dev, build -> prod
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    postcss({
      extract: true,
    }),
    resolve({browser: true}),
    commonjs({
      include: ['node_modules/**'],
      exclude: ['node_modules/process-es6/**'],
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement', 'useState', 'useEffect'],
        'node_modules/react-dom/index.js': ['render'],
      },
    }),
    babel({exclude: 'node_modules/**'}),
    replace({
      'process.env.NODE_ENV': production ? JSON.stringify('production') : JSON.stringify('development'),
    }),
  ],
};
