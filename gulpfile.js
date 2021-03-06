var gulp 			= require('gulp'),
	autoprefixer 	= require('gulp-autoprefixer'),
	rename 			= require('gulp-rename'),
	concat 			= require('gulp-concat'),
	jshint 			= require('gulp-jshint'),
	browserSync 	= require('browser-sync').create(),
	del 			= require('del'),
	fs 				= require('fs'),
	jsFiles 		= [];

var jsFiles = [		
			"js/partials/helpers.js",
			"js/partials/main.js",	
			"js/partials/defaults.js",
			"js/partials/request.js",	
			"js/partials/user.js",
			"js/partials/modal.js",
			"js/partials/editor.js",				
			"js/partials/fields.js",
			"js/partials/sections.js",
			"js/partials/form.js",
			"js/partials/fieldSource.js"
		];


// handles pipe error
function pipeError (error) {
	console.log(error.message);
}

// deletes files before build
gulp.task('del',function () {
	del([
		'./js/app.js'
	]);
});

// browser sync
gulp.task('browser-sync', function() {
    browserSync.init({
    	server 	: "./"
    });
});

// jshint
gulp.task('jshint',function () {
	gulp.src('js/partials/**/*')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

// css
gulp.task('css',function () {
	gulp.src('./css/dev.css')
		.pipe(autoprefixer())
		.pipe(rename('style.css'))
		.pipe(gulp.dest('./css/'));
});

// scripts
gulp.task('scripts',['del','jshint'],function () {
	gulp.src(jsFiles)
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./js/'))
		.on('error',pipeError)
		.on('end',browserSync.reload);
});

// watch
gulp.task('watch',
	[
		'css',
		'scripts',
		'browser-sync'
	],function () {

	// watch
	gulp.watch('./css/dev.css',['css']);
	gulp.watch('./js/partials/**/*',['scripts']);
	gulp.watch('./**/*.html').on('change',browserSync.reload);
	gulp.watch('./**/*.css').on('change',browserSync.reload);
});