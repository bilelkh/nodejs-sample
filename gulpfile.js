'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyHtml = require("gulp-minify-html");
var minifyCss = require("gulp-minify-css");
var spawn = require('child_process').spawn;
var node;

// Lint Task
gulp.task('hint', function() {
    return gulp.src('./server/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('./client/public/javascript/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/client/public/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/client/public/js'));
});

gulp.task('minify-html', function () {
    gulp.src('./client/public/static_pages/*.html') // path to your files
    .pipe(minifyHtml())
    .pipe(gulp.dest('./dist/client/public/static_pages'));
});

gulp.task('minify-css', function () {
    gulp.src('./client/public/css/*.css') // path to your file
    .pipe(minifyCss())
    .pipe(gulp.dest('./dist/client/public/css'));
});

gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['./server/server.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
});
 
/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('watch', function() {
  gulp.run('server');
 
  gulp.watch(['*.*'], function() {
    gulp.run('server');
  });
});

// gulp.task('default', ['hint', 'watch']);
gulp.task('default', ['watch']);