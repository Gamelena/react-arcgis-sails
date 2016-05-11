module.exports = function(grunt) {
    grunt.config.set('wiredep', {
        dev: {
            src: ['views/inject/*.ejs'],
            ignorePath: 'assets/'
        },
        build: {
            src: ['views/inject/*.ejs'],
            ignorePath: 'assets/'
        }
    });
    grunt.loadNpmTasks('grunt-wiredep');
};
