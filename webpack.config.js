const webpack = require("webpack");
const path = require("path");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");//提取css
const HtmlWebpackPlugin = require("html-webpack-plugin"); //压缩html 将打包后的js放进自动html
/*const es3ifyPlugin = require('es3ify-webpack-plugin');//ie8 关键字 "default"*/
/*const WebpackDevServer = require("webpack-dev-server");*/




module.exports = {
	entry:{
        "vendor":["jquery/dist/jquery.min.js","bootstrap/dist/js/bootstrap.min.js","./build/mditor-master/src/mditor.js"],
        "index": path.join(__dirname , "/public/js/index.js"),
        "admin": path.join(__dirname , "/public/js/admin.js")
	},
	output:{
		path: path.join(__dirname , "/build/"),
        publicPath: "/", 
        filename: "[name]_[chunkhash].js"
	},
/*	devtool:"eval-source-map",*/
    devServer:{
        contentBase: ["./build/"],
        historyApiFallback:true,
        inline:true,
        hot:true,
        port:8001
    },
	module:{
        rules:[
            {
            	test:/\.css$/,
            	exclude:["node_modules"],
            	use: ExtractTextWebpackPlugin.extract({ //压缩css
            		fallback: "style-loader",
            		use: [
                        {
                            loader:"css-loader",
                            options:{
                                minimize: true
                            }
                        }
                    ]
            	})
            },
            {
            	test:/\.js$/,
            	exclude:["node_modules"],
            	use:[
                    {
                    	loader:"babel-loader"
                    }
            	]
            },
            {
                test:/\.ejs$/,
                exclude:["node_modules"],
                use:[
                    {
                        loader:"ejs-loader",
                        
                    }
                ]
            },
            {
                test:/\.(jpg|jpeg|png|gif)$/,
                use:[
                    {
                        loader:"url-loader",
                        options:{
                            limit:8192
                        }
                    }
                ]
            },
            {
                test:/\.(eot|svg|dtd|ttf|woff|woff2)$/,
                use:[
                    {
                        loader:"file-loader"
                    }
                ]
            }
        ]
	},
	plugins:[
        /*new es3ifyPlugin(),*/
        new ExtractTextWebpackPlugin({ //提取css 文件
            filename:"[name]_[contenthash].css"
        }),//大坑！此文件路径不是相对于 webpack 配置文件 而是相对于编译后的 引用了 css 文件的js 文件 跟js文件同级
        /*new HtmlWebpackPlugin({
        	template: __dirname + "/view/web/index.html",
        	filename: __dirname + "/build/index.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
        	chunks: ["index"]
        }),*/
        /*
        new HtmlWebpackPlugin({
            template: __dirname + "/view/web/blog.html",
            filename: __dirname + "/build/blog.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["index"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/web/liuyan.html",
            filename: __dirname + "/build/liuyan.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["index"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/web/link.html",
            filename: __dirname + "/build/link.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["index"]
        }),
        /*new HtmlWebpackPlugin({
            template: __dirname + "/view/web/article.html",
            filename: __dirname + "/build/article.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["index"]
        }),*/
        //后台 html
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/article_add.html",
            filename: __dirname + "/build/admin/article_add.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/article_all.html",
            filename: __dirname + "/build/admin/article_all.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/article_category.html",
            filename: __dirname + "/build/admin/article_category.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/article_update.html",
            filename: __dirname + "/build/admin/article_update.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/index.html",
            filename: __dirname + "/build/admin/index.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/link_add.html",
            filename: __dirname + "/build/admin/link_add.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/link_all.html",
            filename: __dirname + "/build/admin/link_all.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/link_dsh.html",
            filename: __dirname + "/build/admin/link_dsh.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/liuyan_all.html",
            filename: __dirname + "/build/admin/liuyan_all.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/view/admin/login.html",
            filename: __dirname + "/build/admin/login.html",
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["admin","vendor"]
        }),
        //
        new HtmlWebpackPlugin({
            template: path.join(__dirname , "/view/web/public.html"),
            filename: path.join(__dirname , "/build/public.html"),
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            chunks: ["index"]
        }),
        new webpack.ProvidePlugin({//由于 Bootstrap 依赖于 jQuery，所以在代码中 import jQuery from ‘jquery’ 是不够的，这只是解决了自己代码对 jQuery 的依赖，在此处使用了webpack.ProvidePlugin
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({ //提取第三方包 到 vendor文件
          name: "vendor",
          chunks:["vendor"],
          minChunks: Infinity,
        })
	],
	resolve:{
		alias:{},
		extensions:[".js",".css",".json"],
		modules:["node_modules"]
	}
	
}