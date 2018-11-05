'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      notify = require('gulp-notify'),
      plumber = require('gulp-plumber'),
      pleeease = require('gulp-pleeease'),
      runSequence = require('run-sequence'),
      imagemin = require('imagemin'),
      pngquant = require('imagemin-pngquant'),
      browserSync = require('browser-sync');

// PATH /////////////////////////////////
var PUB_ROOT_PATH = './';

// BUILD /////////////////////////////////
// CSS
gulp.task('build:css', function() {
    return gulp.src(PUB_ROOT_PATH + '_src/**/*.scss')
    .pipe(plumber({
        errorHandler: notify.onError('Error on <gulp sass>: <%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(pleeease({
        browsers: ['last 1 versions'],
        opacity: true,
        minifier: false,
        mqpacker: true
    }))
    .pipe(sourcemaps.write('./_maps/'))
    .pipe(notify('Complete <gulp sass>'))
    .pipe(gulp.dest(PUB_ROOT_PATH))
});

// IMG
gulp.task('imagemin', function(){
  return gulp.src(PUB_ROOT_PATH + '**/img/*.{png,jpg,gif,svg}')
    .pipe(imagemin(
      [pngquant({quality: '65-80', speed: 1})]
    ))
    .pipe(imagemin())
    .pipe(gulp.dest(PUB_ROOT_PATH + '_src/img/'));
});

// publish /////////////////////////////////
gulp.task('publish', function() {
    return runSequence(
        'build:css',
        'browserReload'
    );
});

// browserReload /////////////////////////////////
gulp.task('browserReload', function() {
    browserSync.reload();
    notify('Browser Reloaded');
});

// browser sync
gulp.task('browserSync', function() {
    return browserSync.init(null, {
        server: {
            baseDir: PUB_ROOT_PATH,
            port: 3001
        }
    });
});

// watch
gulp.task('watch', function() {
    gulp.watch(PUB_ROOT_PATH + '_src/**/*.scss', ['publish']);
    gulp.watch(PUB_ROOT_PATH + '**/*.js', ['browserReload']);
    gulp.watch(PUB_ROOT_PATH + '**/*.html', ['browserReload']);
    gulp.watch(PUB_ROOT_PATH + '**/img/*.{png,jpg,gif,svg}', ['imagemin']);
});

// default ////////////////////////////////////////////////////////////////////////////////////
gulp.task('default', function() {
    return runSequence(
        'publish',
        'browserSync',
        'watch'
    );
});
