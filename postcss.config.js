//postcss: [clean(), mqPacker(), autoprefixer({add:true, browsers: ['last 5 versions']})]

var autoprefixer = require('autoprefixer');
var mqPacker = require('css-mqpacker');
var clean = require('postcss-clean');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: ['last 5 versions']
    }),
    mqPacker(),
    clean()
  ]
};
