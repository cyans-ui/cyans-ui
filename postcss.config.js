module.exports = {
  plugins: [
    require("stylelint")({}),
    require('postcss-discard-comments')({ removeAll: true }),
    require('lost')({}),
    require("postcss-cssnext")(require("./cssnext.config.json")),
    require("postcss-reporter")({}),
    require('cssnano')({ preset: 'default' })
  ]
};