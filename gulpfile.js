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

gulp.task('styles', function() {
	return gulp.src('./src/main/design/**/*.scss')
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'expanded',
			includePaths: require('node-normalize-scss').includePaths
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],
			cascade: false
		}))
		.pipe(gulp.dest('./src/main/webapp/resources'));
});

gulp.task('fonts', function () {
	return gulp.src([
		'node_modules/font-awesome/fonts/*'
	]).pipe(gulp.dest('./src/main/webapp/resources/fonts'));
});

gulp.task('clean', function () {
	return gulp.src(['./src/main/webapp/resources/'], { read: false }).pipe(clean());
});

gulp.task('build', ['styles', 'fonts']);

//Watch task
gulp.task('default',['clean'], function() {
	gulp.start('build');
});