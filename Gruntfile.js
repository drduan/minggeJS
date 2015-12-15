'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      scripts: {
        options: {
          separator: '\n',
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        },
        src: ['./lib/morn.define.js', './lib/*.js'],
        dest: './dist/morn.js'
      },
      style: {
        src: ['./css/main.css', './css/*.css'],
        dest: './dist/morn.css'
      }
    },
    watch: {
      scripts: {
        files: ['./lib/*.js'],
        tasks: 'concat:scripts'
      },
      style: {
        files: ['./css/*.css'],
        tasks: 'concat:style'
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.registerTask('default', ['watch:scripts']);
  grunt.registerTask('css', ['watch:style']);
  grunt.registerTask('cat', ['concat:style']);
};