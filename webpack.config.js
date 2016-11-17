module.exports = {
	entry: "./app-client.js",
	output: {
		filename: "public/bundle.js"
	},
	resolve: {
		extensions: ['', '.js','.jsx', '.vue']
	},
	module: {
		loaders: [
			{
				exclude: /(node_modules|app-server.js)/,
				'loader':'babel-loader',
				query:{
					presets:['react','es2015','stage-3']
				}
			}
		]
	}
};
