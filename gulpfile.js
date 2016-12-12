var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
 return gulp.src('./sass/**/*.scss')
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(gulp.dest('./css'));
});

gulp.task('default', ['sass'], function() {
  watch('./sass/**/*.scss', function () {
    return gulp.src('./sass/**/*.scss'.on('error', sass.logError))
      .pipe(sass())
      .pipe(gulp.dest('./css'))
      .pipe(browserSync.stream());
  });
  watch('./index.html', function () {
    browserSync.reload("./index.html");
  });

  browserSync.init({
          server: {
              baseDir: "./"
          }
  });

});
