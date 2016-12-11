var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();

gulp.task('default', function() {
  watch('sass/**/*.scss', function () {
    gulp.src('sass/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('css'))
      .pipe(browserSync.stream());
  });
  watch('index.html', function () {
    browserSync.reload("index.html");
  });

  browserSync.init({
          server: {
              baseDir: "./"
          }
      });
});
