import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'
import vue from 'rollup-plugin-vue'
import replaceHtmlVars from 'rollup-plugin-replace-html-vars'
import butternut from 'rollup-plugin-butternut'
import { terser } from "rollup-plugin-terser"

const prodution = !process.env.ROLLUP_MATCH

export default {
  input: './public/assets/ts/index.ts',
  output: {
    format: 'iife',
    file: './public/assets/js/app.js',
    sourceMap: true//,
    // globals: {
    //   'vue': 'Vue',
    //   'socket.io-client': 'io',
    //   'axios': 'axios',
    //   'vue-router': 'VueRouter',
    //   'js-cookie': 'Cookies'
    // }
  },
  // external: [ 
  //   'vue', 
  //   'socket.io-client', 
  //   'axios', 
  //   'vue-router', 
  //   'js-cookie' 
  // ],
  plugins: [
    resolve({
      extensions: ['.js', '.ts' ],
      jsnext: true,
      main: true
    }),
    commonjs({
      namedExports: { 'node_modules/axios/index.js': [ 'axios' ] }
    }),
    
    typescript({
      allowJs: true,
      tsconfig: false,
      module: 'es2015',
      moduleResolution: "node",
      target: 'es5',
      sourceMap: true
    }),
    vue(),
    replaceHtmlVars({
      files: 'public/*.html',
      from: /(\?t\=)(?:.*)(\")/g,
      to: '$1' + Date.now() + '$2',
    }),
    prodution && terser()
  ]
}