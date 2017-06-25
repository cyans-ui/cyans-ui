module.exports = {
  plugins: [
    require("stylelint")({
      configFile: './.stylelintrc'
    }),
    require('lost')({
      flexbox: 'flex'
    }),
    require("postcss-cssnext")({
      browsers: ['last 1 version'],
      features: {
        customProperties: false
      }
    }),
    require('cssnano')({
      preset: 'default',
      autoprefixer: false,
      minifySelectors: false,
      reduceIdents: false
    }),
    require("postcss-reporter")({
      clearMessages: true,
      clearReportedMessages: true
    })
  ]
};