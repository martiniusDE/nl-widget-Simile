
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline-Simile
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-symbolic-link');
  grunt.loadNpmTasks('grunt-shell');

  var pkg     = grunt.file.readJSON('package.json');
  var nlPaths = grunt.file.readJSON('../Neatline/paths.json');
  var paths   = grunt.file.readJSON('paths.json');

  grunt.initConfig({

    shell: {
      options: {
        stdout: true
      },
      phpunit: {
        command: 'phpunit --color',
        options: {
          execOptions: {
            cwd: 'tests/phpunit'
          }
        }
      },
      bower: {
        command: 'bower install'
      }
    },

    symlink: {
      neatline: {
        link: 'Neatline',
        target: '../Neatline',
        options: {
          overwrite: true
        }
      }
    },

    connect: {
      options: {
        port: 1337
      },
      temporary: {
        options: {
          keepalive: false
        }
      },
      permanent: {
        options: {
          keepalive: true
        }
      }
    },

    clean: {
      payloads: [
        paths.payloads.shared.js,
        paths.payloads.shared.css
      ],
      fixtures: [
        paths.jasmine+'/fixtures/*.json',
        paths.jasmine+'/fixtures/*.html'
      ],
      bower: '/bower_components',
      pkg: 'pkg'
    },

    concat: {

      simile_public: {
        src: [
          paths.vendor.moment,
          paths.src.shared+'/public/*.js'
        ],
        dest: paths.payloads.shared.js+'/simile-public.js'
      },

      simile_editor: {
        src: [
          '<%= concat.simile_public.src %>',
          paths.src.shared+'/editor/*.js'
        ],
        dest: paths.payloads.shared.js+'/simile-editor.js'
      },

      simile_public_css: {
        src: [
          paths.payloads.shared.css+'/simile-public.css'
        ],
        dest: paths.payloads.shared.css+'/simile-editor.css'
      }

    },

    uglify: {

      simile_public: {
        src: '<%= concat.simile_public.src %>',
        dest: paths.payloads.shared.js+'/simile-public.js'
      },

      simile_editor: {
        src: '<%= concat.simile_editor.src %>',
        dest: paths.payloads.shared.js+'/simile-editor.js'
      }

    },

    stylus: {
      compile: {
        files: {
          './views/shared/css/payloads/simile-public.css':
            paths.stylus.shared+'/public/*.styl'
        }
      }
    },

    copy: {
      simile: {
        files: [{
          cwd: 'bower_components/simile/',
          src: '**',
          dest: paths.payloads.shared.js+'/simile',
          flatten: false,
          expand: true
        }]
      }
    },

    watch: {
      payload: {
        files: [
          '<%= concat.simile_public.src %>',
          '<%= concat.simile_editor.src %>',
          paths.stylus.shared+'/**/*.styl'
        ],
        tasks: ['compile']
      }
    },

    jasmine: {

      options: {
        host: 'http://localhost:1337',
        template: 'Neatline/'+nlPaths.jasmine+'/runner.tmpl',
        helpers: [
          'Neatline/'+nlPaths.vendor.js.jasmine_jquery,
          'Neatline/'+nlPaths.vendor.js.jasmine_async,
          'Neatline/'+nlPaths.vendor.js.sinon,
          'Neatline/'+nlPaths.jasmine+'/helpers/*.js',
          'Neatline/'+nlPaths.jasmine+'/assertions/*.js',
          paths.jasmine+'/helpers/*.js',
          paths.jasmine+'/assertions/*.js'
        ]
      },

      neatline: {
        src: [
          'Neatline/'+nlPaths.payloads.shared.js+'/neatline-public.js',
          paths.payloads.shared.js+'/simile-public.js'
        ],
        options: {
          specs: paths.jasmine+'/tests/neatline/**/*.spec.js'
        }
      },

      editor: {
        src: [
          'Neatline/'+nlPaths.payloads.shared.js+'/neatline-editor.js',
          paths.payloads.shared.js+'/simile-editor.js'
        ],
        options: {
          specs: paths.jasmine+'/tests/editor/**/*.spec.js'
        }
      }

    },

    compress: {

      dist: {
        options: {
          archive: 'pkg/NeatlineSimile-'+pkg.version+'.zip'
        },
        dest: 'NeatlineSimile/',
        src: [

          '**',

          '!.git/**',
          '!package.json',
          '!node_modules/**',
          '!bower_components/**',
          '!.grunt/**',
          '!Gruntfile.js',
          '!paths.json',
          '!Neatline/**',
          '!pkg/**',
          '!tests/**'

        ]
      }

    }

  });

  // Run tests.
  grunt.registerTask('default', 'test');

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'shell:bower',
    'symlink',
    'copy',
    'compile'
  ]);

  // Assemble static assets.
  grunt.registerTask('compile', [
    'concat:simile_public',
    'concat:simile_editor',
    'stylus',
    'concat:simile_public_css'
  ]);

  // Assemble/min static assets.
  grunt.registerTask('compile:min', [
    'uglify:simile_public',
    'uglify:simile_editor',
    'stylus',
    'concat:simile_public_css'
  ]);

  // Run PHPUnit.
  grunt.registerTask('phpunit', 'shell:phpunit');

  // Run Jasmine via Connect server.
  grunt.registerTask('jasmine:connect', [
    'connect:temporary',
    'jasmine:neatline',
    'jasmine:editor'
  ]);

  // Mount public Jasmine suite.
  grunt.registerTask('jasmine:neatline:server', [
    'jasmine:neatline:build',
    'connect:permanent'
  ]);

  // Mount editor Jasmine suite.
  grunt.registerTask('jasmine:editor:server', [
    'jasmine:editor:build',
    'connect:permanent'
  ]);

  // Run application tests.
  grunt.registerTask('test', [
    'compile:min',
    'clean:fixtures',
    'phpunit',
    'jasmine:connect'
  ]);

  // Spawn release package.
  grunt.registerTask('package', [
    'compile:min',
    'clean:pkg',
    'compress'
  ]);

};
