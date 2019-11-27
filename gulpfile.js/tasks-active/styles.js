// ==== STYLES ==== //

var gulp = require('gulp'),
    gutil = require('gulp-util'),
	browsersync = require('browser-sync').create(),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    config = require('../../gulpconfig').styles,
    autoprefixer = require('autoprefixer');

// Build stylesheets from source Sass files, autoprefix, and make a minified copy (for debugging) with libsass
gulp.task('styles-libsass', function() {
    return gulp.src(config.build.src)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass(config.libsass))
        .pipe(plugins.postcss([autoprefixer(config.autoprefixer)]))
        .pipe(plugins.sourcemaps.write()) // Write internal sourcemap
		.pipe(plugins.rename(config.assetversion))
        .pipe(gulp.dest(config.build.dest)) // Drops the unminified CSS file into the `build` folder
        .pipe(plugins.rename(config.rename))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.cleanCss(config.minify))
        .pipe(plugins.sourcemaps.write('./')) // Write external sourcemap
        .pipe(gulp.dest(config.build.dest)) // Drops a minified CSS file into the `build` folder for debugging
		.pipe(browsersync.stream({match: '**/*.css'}));
});


// Easily configure the Sass compiler from `/gulpconfig.js`
gulp.task('styles', ['styles-' + config.compiler]);
