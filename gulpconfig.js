// ==== CONFIGURATION ==== //

// Project paths
var project 		= 'cubestrap',
    src 			= './src/',
    build 			= './dist/',
    npm 			= './node_modules/',
    version 		= '.1',
	oldversion 		= '.0';

// Project settings
module.exports = {
	// REMEMBER: files from node_modules are copied via the comand 'npm update'
    dependencies: {
        normalize: { // Copies `normalize.css` from `node_modules` to `src/scss` and renames it, to be handled as a Sass file
            src: npm + 'normalize.css/normalize.css',
            dest: src + 'assets/scss/common',
            rename: '_normalize.scss'
        },
        html5shiv: { // Copies `html5shiv` from `node_modules` to `build/assets/js/minimaljs`
            src: npm + 'html5shiv/dist/html5shiv-printshiv.min.js',
            dest: src + 'assets/js/legacy'
        },
		fontfaceobserver: {
			src: npm + 'fontfaceobserver/fontfaceobserver.js',
			rename: {
				prefix: '1_'
			},
			dest: src + 'assets/js/minimaljs'
		},
		lazysizes: {
			src: npm + 'lazysizes/lazysizes.js',
			rename: {
				prefix: '1_'
			},
			dest: src + 'assets/js/fulljs'
		}
    },

    browsersync: {
        files: ['./**/*.html', build + '**', '!' + build + '**.map'], // Exclude map files
        notify: false, // In-line notifications (the blocks of text saying whether you are connected to the BrowserSync server or not)
        open: false, // Set to false if you don't like the browser window opening automatically
        port: 3000, // Port number for the live version of the site; default: 3000
		server: {baseDir: "./"}
    },

    images: {
        build: { // Copies images from `src` to `build`; does not optimize
            src: [src + '**/*(*.png|*.jpg|*.jpeg|*.gif|*.ico|*.svg)'],
            dest: build
        },
        dist: {
            src: [build + '**/*(*.png|*.jpg|*.jpeg|*.gif|*.ico|*.svg)'],
            imagemin: {
                optimizationLevel: 7,
                progressive: true,
                interlaced: true
            },
            dest: build
        }
    },

    scripts: {
        bundles: { // Bundles are defined by a name and an array of chunks to concatenate; warning: it's up to you to manage dependencies!
            minimal: ['minimal'],
            full: ['full'],
			cubestrap: ['cubestrap']
        },
        chunks: { // Chunks are arrays of globs matching source files that combine to provide specific functionality
            minimal: [src + 'assets/js/minimaljs/*.js', src + 'assets/js/minimal.js'],
            full: [src + 'assets/js/fulljs/**/*.js', src + 'assets/js/full.js'],
			cubestrap: [src + 'assets/js/jquery/**/*.js', src + 'assets/js/cubestrap/**/*.js', src + 'assets/js/cubestrap.js']
        },
        dest: build + 'assets/js/', // Where the scripts end up
        lint: {
            src: [build + 'assets/js/**/*.js'] // Lint core scripts (for everything else we're relying on the original authors)
        },
        minify: {
            src: [build + 'assets/js/**/*.js', '!' + build + 'assets/js/**/*.min.js'], // Avoid recursive min.min.min.js
            rename: {
                suffix: '.min'
            },
            uglify: { /* output: { comments: "some" } */ },
            dest: build + 'assets/js/'
        },
        namespace: version // Script filenames will be appended with this (optional; leave blank if you have no need for it)
    },

    styles: {
        build: {
            src: [src + 'assets/scss/**/*.scss', '!' + src + 'assets/scss/**/_*.scss'], // Ignore partials
            dest: build + 'assets/css/'
        },
        dist: {
            src: [build + '**/*.css', '!' + build + '**/*.min.css'],
            minify: {
                keepSpecialComments: 1,
                roundingPrecision: 3
            },
            dest: build + '/app/themes/' + project
        },
        compiler: 'libsass',
        autoprefixer: {
            browsers: ['> 3%', 'last 2 versions', 'ie 9', 'ios 6', 'android 4']
        },
		assetversion: {
			suffix: version
		},
        rename: {
            suffix: '.min'
        },
        minify: {
            keepSpecialComments: 1,
            roundingPrecision: 3
        },
        libsass: { // Requires the libsass implementation of Sass
            includePaths: [npm], // Adds the `node_modules` directory to the load path so you can @import directly
			require: 'susy',
			precision: 6
        }
    },

	wipe: {
		changeassetversion: [build + 'assets/css/**' + oldversion + '.min.css', build + 'assets/css/**' + oldversion + '.min.css.map', build + 'assets/css/*' + oldversion + '.css', build + 'assets/js/*' + oldversion + '.min.js', build + 'assets/js/*' + oldversion + '.js'], // Get all the assets with old version numbers to get cleaned out of `build`
		wipedev: [build + '/**']
	},

    watch: { // What to watch before triggering each specified task
        src: {
            styles: src + 'assets/scss/**/*.scss',
            scripts: src + 'assets/js/**/*.js',
            images: src + '**/*(*.png|*.jpg|*.jpeg|*.gif|*.ico|*.svg)'
        },
        watcher: 'browsersync' // Who watches the watcher? --> We use BrowserSync ('browsersync')
    }

};


