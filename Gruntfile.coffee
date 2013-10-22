module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-typescript'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    typescript:
      compile:
        src: ['src/**/*.ts', 'test/**/*.ts']
        dest: 'compiled'
        options:
          target: 'es3'
      release:
        src:  ['compiled/templates.ts', 'src/**/*.ts']
        dest: 'compiled/compiled.js'
        options:
          target: 'es3'

    concat:
      templates:
        files:
          'compiled/templates.js': ['templates/*.html', 'templates/*.css']
        options:
          banner: "var Template = { html: {}, css: {} };\n"
          process: (content, path) =>
            name    = path.replace(/^.+\/|\..+$/g, '')
            content = JSON.stringify(content.toString().replace(/^\s+|\s+$/g, '').replace(/\s*\n\s*/g, "\n"))
            if /\.css$/.test(path)
              "Template.css['#{name}'] = #{content};"
            else
              "Template.html['#{name}'] = #{content};"

      dist:
        files:
          'dist/niconicofavlist.user.js': [
            'etc/intro.txt'
            'compiled/templates.js'
            'compiled/compiled.js'
            'etc/outro.txt'
          ]
        options:
          banner: grunt.file.read 'etc/header.txt'

    clean:
      compiled:
        src: ['compiled']

    watch:
      files: ['src/**/*.ts', 'test/**/*.ts', 'templates/**/*.html', 'templates/**/*.css']
      tasks: ['release']

  grunt.registerTask 'compile', ['concat:templates', 'typescript:compile']
  grunt.registerTask 'release', ['concat:templates', 'typescript:release', 'concat:dist']
  grunt.registerTask 'default', ['compile']
