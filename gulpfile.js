var gulp = require('gulp'),
	watch = require('gulp-watch'),
	bs = require('browser-sync').create(),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps');


gulp.task('copy', function() {
	gulp.src('bower_components/angular/angular**.js').pipe(gulp.dest('assets/js/libs'));
	gulp.src('bower_components/jquery/dist/**.js').pipe(gulp.dest('assets/js/libs/jquery'));
	gulp.src('bower_components/jquery/dist/**.map').pipe(gulp.dest('assets/js/libs/jquery'));
});

gulp.task('js-concat', function() {
	return gulp.src('src/js/*.js')
		.pipe(concat({ path: 'app.js', stat: { mode: 0666 }}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('assets/js'));
});

gulp.task('sass', function () {
	return gulp.src('src/scss/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('assets/css'));
});

gulp.task('watch', function() {
	
	watch(['*.html', 'assets/templates/*.html'], function(files) {
		console.log('file changed');
		bs.reload();
	});
	
	watch('src/scss/*.scss', function(files) {
		gulp.run('sass', function() {
			console.log('scss compiled');
			bs.reload();
		});
	});
	
	watch('src/js/*.js', function(files) {
		gulp.run('js-concat', function(){
			console.log('js compiled');
			bs.reload();
		});
	});
});

gulp.task('server', function() {
	
	bs.init({
        server: './'
    });
	
	gulp.run('copy');
	gulp.run('js-concat');
	gulp.run('sass');
	gulp.run('watch');
});

gulp.task('default', ['server']);
