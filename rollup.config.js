import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'
import vue from 'rollup-plugin-vue'
import replaceHtmlVars from 'rollup-plugin-replace-html-vars'
import { terser } from 'rollup-plugin-terser'
import autoprefixer from 'autoprefixer'
import css from 'rollup-plugin-css-only'

const production = false //!process.env.ROLLUP_MATCH

export default [{
  input: './public/assets/ts/index.ts',
  output: {
    format: 'iife',
    file: './public/static/app.js',
    sourceMap: true
  },
  plugins: [
    resolve({
      extensions: ['.js', '.ts' ],
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    typescript({
      allowJs: true,
      tsconfig: false,
      module: 'es2015',
      sourceMap: true
    }),
    css(),
    vue({ 
      css: false,
      style: {
        postcssOptions: {
          extract: true
        },
        postcssPlugins: [
          autoprefixer()
        ]
      }
    }),
    replaceHtmlVars({
      files: 'public/*.html',
      from: /(\?t\=)(?:.*)(\")/g,
      to: '$1' + Date.now() + '$2',
    }),
    production && terser()
  ]
}]