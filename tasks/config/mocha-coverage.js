/**
 * Created by leo on 3/26/15.
 */

/**
 * Run test and show unit test coverage.
 *
 * ---------------------------------------------------------------
 *
 *
 * For usage docs see:
 * 		https://github.com/sergiocruz/sails-unit-test
 */
module.exports = function(grunt) {
  grunt.config.set('mocha_istanbul', {
    coverage: {
    // the folder, not the files
      src: 'test',
      options: {
        coverageFolder: 'coverage',
        mask: '**/*.test.js',
        reporter: 'nyan',
        timeout: 5000,
        root: 'api/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');
};

