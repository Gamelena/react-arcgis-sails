/**
 * Created by leo on 3/26/15.
 */

module.exports = function (grunt) {
  grunt.registerTask('coverage', [
    'mocha_istanbul:coverage'
  ]);
};