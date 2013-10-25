module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-typescript'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    typescript:
      compile:
        src:  ['src/**/*.ts', '!src/userscript/main.ts']
        dest: 'compiled/compiled.js'
        options:
          sourcemap: true
          declaration: true
      test:
        src:  ['test/**/*.ts']
        dest: 'compiled'
      userscript:
        src:  ['src/userscript/main.ts']
        dest: 'compiled/userscript.js'
        options:
          comments: false

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

      userscript:
        files:
          'dist/niconicofavlist.user.js': [
            'etc/userscript/intro.txt'
            'compiled/userscript.js'
            'etc/userscript/outro.txt'
          ]
          'dist/niconicofavlist.meta.js': []
        options:
          banner: grunt.file.read 'etc/userscript/header.txt'

    clean:
      compiled:
        src: ['compiled']

    watch:
      files: ['src/**/*.ts', 'test/**/*.ts', 'templates/**/*.html', 'templates/**/*.css']
      tasks: ['release']

  grunt.registerTask 'compile', ['concat:templates', 'typescript:compile', 'typescript:test']
  grunt.registerTask 'release', ['concat:templates', 'typescript:userscript', 'concat:userscript']
  grunt.registerTask 'default', ['compile']
