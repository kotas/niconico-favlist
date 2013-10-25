module.exports = (config) ->
  config.set
    basePath: '.'
    files: [
      'bower_components/jquery/jquery.js'
      'bower_components/sinon/index.js'
      'compiled/compiled.js'
      'compiled/test/spec_helper.js'
      'compiled/test/specs/**/*.js'
    ]

    frameworks: ['mocha', 'chai']
    browsers: ['Chrome']
    reporters: ['progress']

    captureTimeout: 60000
    autoWatch: false
    singleRun: false
