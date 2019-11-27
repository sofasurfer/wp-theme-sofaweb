// ==== dependencies ==== //

var gulp        = require('gulp'),
    plugins     = require('gulp-load-plugins')({ camelize: true }),
    config      = require('../../gulpconfig').dependencies
;

// Use this task to copy and transform source files managed by npm
gulp.task('dependencies', ['dependencies-normalize', 'dependencies-html5shiv', 'dependencies-fontfaceobserver', 'dependencies-lazysizes']);

// A hack used to get around Sass's inability to natively @import vanilla CSS; see: https://github.com/sass/sass/issues/556
gulp.task('dependencies-normalize', function() {
  return gulp.src(config.normalize.src)
  .pipe(plugins.changed(config.normalize.dest))
  .pipe(plugins.rename(config.normalize.rename))
  .pipe(gulp.dest(config.normalize.dest));
});

// copy html5shiv from node_modules to theme (devbox)
gulp.task('dependencies-html5shiv', function() {
  return gulp.src(config.html5shiv.src)
  .pipe(plugins.changed(config.html5shiv.dest))
  .pipe(gulp.dest(config.html5shiv.dest));
});

// copy fontfaceobserver from node_modules to theme (devbox)
gulp.task('dependencies-fontfaceobserver', function() {
  return gulp.src(config.fontfaceobserver.src)
  .pipe(plugins.changed(config.fontfaceobserver.dest))
  .pipe(plugins.rename(config.fontfaceobserver.rename))
  .pipe(gulp.dest(config.fontfaceobserver.dest));
});

// copy lazysizes from node_modules to theme (devbox)
gulp.task('dependencies-lazysizes', function() {
  return gulp.src(config.lazysizes.src)
  .pipe(plugins.changed(config.lazysizes.dest))
  .pipe(plugins.rename(config.lazysizes.rename))
  .pipe(gulp.dest(config.lazysizes.dest));
});
