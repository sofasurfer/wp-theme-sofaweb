// ==== BROWSERSYNC ==== //

var gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    config = require('../../gulpconfig').browsersync;

// BrowserSync: be sure to setup `proxy` in `config.js
// Quick start: connect all your devices to the same network (e.g. wifi) and navigate to the address output in the console when you run `gulp`
gulp.task('browsersync', ['build'], function() {
    browsersync.init(config);
    gulp.watch(config.files).on('change', browsersync.reload);
});
