import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'

// export default {
//   input: 'src/main.js',
//   output: {
//     file: 'bundle.js',
//     format: 'cjs'
//   },
//   plugins: [ 
//     commonjs(), 
//     resolve(),
//     typescript(),
//     vue(),
//     postcss({
//       plugins: [ 'Stylus' ]
//     })
//   ]
// };

export default {
  input: './public/assets/ts/vue/App.vue',
  output: {
    format: 'esm',
    file: './public/assets/js/app.js'
  },
  external: [ 'vue' ],
  plugins: [
    typescript({
      tsconfig: false,
      experimentalDecorators: true,
      module: 'es2015'
    }),
    vue()
  ]
}