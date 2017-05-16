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

var buildMenu = function(activeItem) {
	activeItem = (typeof activeItem === 'undefined' || activeItem === null) ? '' : activeItem;
	return '<li class="mi' + ((activeItem == 'library') ? ' active' : '') + '"><a class="mi-label" href="books.html">Library</a></li>' +
		'<li class="mi' + ((activeItem == 'bookcase') ? ' active' : '') + '"><a class="mi-label" href="bookcase.html">Bookcase</a></li>' +
		'<li class="mi' + ((activeItem == 'entries') ? ' active' : '') + '"><a class="mi-label" href="entries.html">Reading Entries</a></li>';
};

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
		.pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true, buildMenu: buildMenu}})) //To set environment variables in-line
		.pipe(gulp.dest('./src/main/webapp'));
});

gulp.task('fonts', function () {
	return gulp.src([
		'node_modules/font-awesome/fonts/*'
	]).pipe(gulp.dest('./src/main/webapp/resources/fonts'));
});

gulp.task('other-resources', function () {
	return gulp.src(['./src/main/design/images/*']).pipe(gulp.dest('./src/main/webapp/resources/images'))
});

gulp.task('clean', function () {
	return gulp.src(['./src/main/webapp/resources/'], { read: false }).pipe(clean());
});

gulp.task('build', ['styles', 'fonts', 'html', 'other-resources']);

//Watch task
gulp.task('default',['clean'], function() {
	gulp.start('build');
});