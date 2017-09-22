// AdminLTE Gruntfile
module.exports = function (grunt) {

  'use strict';

  grunt.initConfig({
    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['css/rem/*-rem.css']
    },
    px2rem: {
      default: {
        options: {
          designWidth : 640,//设计稿宽度
          baseFont    : 64,//基础字体
          border      : 0,//1不处理border，0处理
          ie8         : 0,//1生成ie8代码，0不生成
          mode        : 0,//0px转rem，1rem转px
          media       : 0,//1生成meadia query代码，0不生成
          dest        : 'css/rem/'//rem css输出目录
        },
        files: [{
          src : ['css/css/myindex.css']//要监听的css目录
        }]
      }
    },
    watch: {
      files: [
        "less/*.less","css/css/.css"],
      tasks: ["less","cssmin"]
    },
    less: {
      development: {
        options: {
          compress: false
        },
        files: {
          "css/css/myindex.css": "less/myindex.less"
        }
      }
    },
    cssmin: {
      css: {
        src:'css/css/myindex.css',
        dest:'css/mincss/myindex.min.css'

      }

    },
    concat:{
      options: {
        separator: ';'
      },
      eipts: {
        src: ['eipts/**/*.js'],
        dest: 'dist/js/eipts-all.js'
      },
      css : {
        src: ['src/asset/*.css'],
        dest:'dest/asset/all.css'
      }
    },
    uglify: {
      options: {
        mangle: true,
        preserveComments: 'some'
      },
      my_target: {
        files: {
          'dist/js/eipts-all.min.js':['eipts/**/*.js']
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      eipts:{
        src:['eipts/**/*.js']
      }
    },
    csslint: {
      options: {
        csslintrc: 'less/less/.csslintrc'
      },
      dist: [
        'css/AdminLTE.css','css/main.css'
      ]
    }
  });
  grunt.loadTasks('task');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-hash');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('lint', ['jshint', 'csslint']);
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('rem', ['clean','px2rem']);
};
