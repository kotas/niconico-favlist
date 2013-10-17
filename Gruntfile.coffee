module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    typescript:
      compile:
        src: ['src/**/*.ts', 'test/**/*.ts']
        dest: 'compiled'
        options:
          target: 'es3'
      release:
        src:  ['src/**/*.ts']
        dest: 'compiled/favlist.js'
        options:
          target: 'es3'

    concat:
      options:
        banner: grunt.file.read 'etc/header.txt'
      dist:
        src: ['etc/intro.txt', 'compiled/favlist.js', 'etc/outro.txt']
        dest: 'dist/niconicofavlist.user.js'

    clean:
      compiled:
        src: ['compiled', 'dist']

    watch:
      files: ['src/**/*.ts', 'test/**/*.ts']
      tasks: ['compile']

  grunt.loadNpmTasks 'grunt-typescript'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'compile', ['typescript:compile']
  grunt.registerTask 'release', ['typescript:release', 'concat']
  grunt.registerTask 'default', ['compile']
