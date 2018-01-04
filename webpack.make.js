'use strict';

// Modules
var webpack = require('webpack');
var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function makeWebpackConfig (options) {
  /**
   * Environment type
   * BUILD is for generating minified builds
   * TEST is for generating test builds
   */
  var BUILD = !!options.BUILD;
  var TEST = !!options.TEST;

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  if (TEST) {
    config.entry = void 0;
  } else {
    config.entry = {
      application: path.resolve(__dirname, 'assets/javascripts/application.js'),
      vendors: [
        'angular',
        '@uirouter/angularjs'
      ]
    };
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  if (TEST) {
    config.output = {};
  } else {
    config.output = {
      // Absolute output directory
      path: __dirname + '/build',

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: BUILD ? '/' : 'http://localhost:8080/',

      // Filename for entry points
      // Only adds hash in build mode
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
    };
  }

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (TEST) {
    config.devtool = 'inline-source-map';
  } else if (BUILD) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    rules: [{
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      // FONTS LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy svg, woff, woff2, ttf, eot files to output
      test: /\.(svg|woff|woff2|ttf|eot)$/,
      loader: 'file-loader?name=fonts/[name].[hash].[ext]',
      include: [
        path.resolve(__dirname, 'assets/fonts')
      ]
    }, {
      // IMAGES LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif files to output
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      loader: 'file-loader?name=images/[name].[hash].[ext]',
      exclude: [
        path.resolve(__dirname, 'assets/fonts')
      ]
    }, {
      test: /\.html$/,
      loaders: 'html-loader'
    }]
  };

  // SCSS LOADER
  // Reference: https://github.com/webpack/css-loader
  // Creates style nodes from JS strings. In development used for hot-loading.
  //
  // Reference https://github.com/webpack-contrib/sass-loader
  // Compiles Sass to CSS
  //
  // Reference: https://github.com/postcss/postcss-loader
  // Postprocess your css with PostCSS plugins
  //
  // Reference: https://github.com/webpack/style-loader
  // Use style-loader in development for hot-loading
  var scssLoader = {
    test: /\.scss$/,
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files in production builds
    loader: extractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader!postcss-loader!sass-loader'
    })
  };

  // CSS LOADER
  // Reference: https://github.com/webpack/css-loader
  // Creates style nodes from JS strings. In development used for hot-loading.
  //
  // Reference: https://github.com/webpack/style-loader
  // Use style-loader in development for hot-loading
  var cssLoader = {
    test: /\.css$/,
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files in production builds
    loader: extractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader'
    })
  };

  if (TEST) {
    // Reference: https://github.com/webpack/null-loader
    // Skip loading scss and css in test mode. Return an empty module.
    scssLoader.loader = 'null-loader';
    cssLoader.loader = 'null-loader';

    // ISTANBUL LOADER
    // https://github.com/deepsweet/istanbul-instrumenter-loader
    // Instrument JS files with istanbul-lib-instrument for subsequent code coverage reporting
    // Skips node_modules and files that end with .spec.js
    config.module.rules.push({
      enforce: 'pre',
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /\.spec\.js$/
      ],
      loader: 'istanbul-instrumenter-loader',
      query: {
        esModules: true
      }
    })
  }

  // Add cssLoader to the loader list
  config.module.rules.push(scssLoader);
  config.module.rules.push(cssLoader);

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new extractTextPlugin({
      filename: '[name].[hash].css',
      disable: !BUILD || TEST
    })
  ];

  // In test mode skip rendering index.html
  if (!TEST) {
    config.plugins.push(
      // Reference: https://github.com/ampedandwired/html-webpack-plugin
      // Render index.html
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, 'assets/index.html'),
        inject: 'body'
      })
    );
  }

  // Add build specific plugins
  if (BUILD) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
        mangle: false
      }),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
      // Generate an extra chunk, which contains common modules shared between entry points.
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors'
      })
    );
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: path.resolve(__dirname, 'build'),
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  };

  return config;
};
