import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default [
	{
		// 入口文件
		input: 'packages/vue/src/index.ts',
		output: [
			// 导出一个 iife 模块包；
			// amd 异步模块定义，用于像 RequireJS这样的模块加载器
			// cjs CommonJS，适用于 Node 和 Browserify/Webpack
			// esm 将软件包保存为 ES 模块对象，通过 <script type=module> 引入
			// iife -- 一个自动执行的功能，适合作为 <script> 标签
			// umd 通用模块定义，以 amd，cjs，iife 为一体
			{
				sourcemap: true, // 开启sourceMap
				file: './packages/vue/dist/vue.js', // 导出的文件地址
				format: 'iife', // 生成包的格式
				name: 'Vue', // 变量名 举例： import { Vue } from 'vue.js'
			},
		],
		// 	插件
		plugins: [
			typescript({
				sourceMap: true,
				// compilerOptions: {
				// 	lib: ['es5', 'es6', 'dom'],
				// 	target: 'es5',
				// },
			}),
			nodeResolve(),
			commonjs(),
		],
	},
]
