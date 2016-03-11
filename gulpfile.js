var gulp = require('gulp'),
	watch = require('gulp-watch'),
	bs = require('browser-sync').create(),
	sass = require('gulp-sass'),
	concat = require('gulp-concat');


gulp.task('copy', function() {
	gulp.src('bower_components/angular/angular**.js').pipe(gulp.dest('assets/js/libs'));
	gulp.src('bower_components/jquery/dist/**.js').pipe(gulp.dest('assets/js/libs/jquery'));
	gulp.src('bower_components/jquery/dist/**.map').pipe(gulp.dest('assets/js/libs/jquery'));
});

gulp.task('js-copy', function() {
	gulp.src('src/js/*.js').pipe(gulp.dest('assets/js/'));
});

gulp.task('sass', function () {
	return gulp.src('src/scss/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('assets/css'));
});

gulp.task('watch', function() {
	
	watch('*.html', function(files) {
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
		gulp.run('js-copy', function() {
			console.log('js file changed');
			bs.reload();
		});
	});
});

gulp.task('server', function() {
	
	bs.init({
        server: './'
    });
	
	gulp.run('copy');
	gulp.run('js-copy');
	gulp.run('sass');
	gulp.run('watch');
});

gulp.task('default', ['server']);
