// ==== UTILITIES ==== //

var gulp        = require('gulp'),
	plugins     = require('gulp-load-plugins')({ camelize: true }),
	del         = require('del'),
	runSequence = require('run-sequence').use(gulp),
	config      = require('../../gulpconfig').wipe
;

// Delete assets with old assetversion, then start 'build' to generate new assets and tasks to generate critical css
gulp.task('wipeversion', function() {
	runSequence('deleteassets','build','generateccss','finalizeccss')
});

gulp.task('deleteassets', function() {
	del(config.changeassetversion)
});

// Wipe '_dev' directory except uploads
gulp.task('wipedev', function() {
	del(config.wipedev)
});
