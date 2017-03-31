/**
 * Used to compile scss into css
 * @author mlickei
 **/

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var fontAwesome = require('node-font-awesome');
var clean = require('gulp-clean');
var preprocess = require('gulp-preprocess');

gulp.task('styles', function() {
	return gulp.src('./src/main/design/css/**/*.scss')
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'expanded',
			includePaths: require('node-normalize-scss').includePaths
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],
			cascade: false
		}))
		.pipe(gulp.dest('./src/main/webapp/resources/css'));
});

gulp.task('html', function () {
	gulp.src(['./src/main/design/html/**/*.html', '!./src/main/design/html/**/_*.html'])
		.pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}})) //To set environment variables in-line
		.pipe(gulp.dest('./src/main/webapp'));
});

gulp.task('fonts', function () {
	return gulp.src([
		'node_modules/font-awesome/fonts/*'
	]).pipe(gulp.dest('./src/main/webapp/resources/fonts'));
});

gulp.task('clean', function () {
	return gulp.src(['./src/main/webapp/resources/'], { read: false }).pipe(clean());
});

gulp.task('build', ['styles', 'fonts', 'html']);

//Watch task
gulp.task('default',['clean'], function() {
	gulp.start('build');
});