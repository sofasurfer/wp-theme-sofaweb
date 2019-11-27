// ==== MAIN ==== //

var gulp = require('gulp');

// Default task chain: build -> browsersync -> watch
gulp.task('default', ['watch']);

// Build a working copy of the theme
gulp.task('build', ['images', 'scripts', 'styles']);

// NOTE: this is a resource-intensive task!
gulp.task('dist', ['images-dist']);
