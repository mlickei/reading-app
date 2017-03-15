/**
 * Used to compile scss into css
 * @author mlickei
 **/

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');

gulp.task('styles', function() {
	return gulp.src('./src/main/design/**/*.scss')
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],
			cascade: false
		}))
		.pipe(gulp.dest('./src/main/webapp/resources'));
});

//Watch task
gulp.task('default',['styles']);