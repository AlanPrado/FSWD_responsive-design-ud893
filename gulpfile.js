'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const pump = require('pump');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const destDir = './dist/';
const appDir = './app/';

function styles(cb, dist) {
	let tasks = [];

	tasks.push(gulp.src(appDir + 'sass/**/*.scss'));
	tasks.push(sourcemaps.init());
	tasks.push(sass());
	tasks.push(
		autoprefixer({
			browsers: ['last 2 versions']
		}));
	if(dist) tasks.push(cssnano());
 	tasks.push(sourcemaps.write());
    tasks.push(gulp.dest(destDir + 'css'));
	tasks.push(browserSync.stream());

	pump(tasks, cb);
}
gulp.task('styles', (cb) => styles(cb));
gulp.task('styles-dist', (cb) => styles(cb, true));

function copy(options, cb) {
	options = options || {};
	options = {
		src: options.src || '',
		dest: options.dest || '',
		enableSourceMaps: options.enableSourceMaps || false,
		imagemin: options.imagemin || false
	};

	let taskList = []
	if(typeof options.src === "object") { 
		options.src.forEach(function(el, idx) { 
			options.src[idx] = appDir + el;
		});
		taskList.push(gulp.src(options.src));
	} else {
		taskList.push(gulp.src([appDir + options.src, '!' + appDir + '/tests/**/*']));
	}
	if(options.enableSourceMaps) taskList.push(sourcemaps.init());
	if(options.enableSourceMaps) taskList.push(sourcemaps.write());

  if(options.imagemin)
		taskList.push(imagemin({
					            progressive: true,
					            use: [pngquant()]
					        }));

	taskList.push(gulp.dest(destDir + (options.dest)));
	pump(taskList, cb);
}

gulp.task('copy-html', (cb) => copy({src: '**/*.html'}, cb));
gulp.task('copy-images', (cb) => copy({src: 'images/**/*', dest: 'images'}, cb));
gulp.task('copy-images-dist', (cb) => copy({src: 'images/**/*', dest: 'images', imagemin: true}, cb));
gulp.task('copy-favicon', (cb) => copy({ src: ['*.png', '*.xml','*.ico','*.json'] }, cb));

gulp.task('default', ['copy-html', 'copy-images', 'copy-favicon', 'styles'], () => {
	gulp.watch(appDir + 'sass/**/*.scss', ['styles']);
	gulp.watch(appDir + '**/*.html', ['copy-html']);
	gulp.watch(destDir + '**/*.html')
		  .on('change', browserSync.reload);

	browserSync.init({
			 server: destDir
		});
});

gulp.task('dist', ['copy-html', 'copy-images-dist', 'copy-html', 'copy-favicon', 'styles-dist']);